import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { protect } from "../middleware/authMiddleware.js";
import { validateModule, validateModuleUpdate } from "../middleware/validation.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import Module from "../models/Module.js";
import { parseFileContent } from "../services/fileParser.js";
import { generateLearningContent } from "../services/ai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed. Only PDF, TXT, DOC, DOCX files are supported.`), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
        files: 1
    }
});

// Apply rate limiting
router.use(authLimiter);

// @route   GET /api/modules
// @desc    Get all modules for user with pagination and filtering
// @access  Private
router.get("/", protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || '-updatedAt';
        const search = req.query.search;
        const category = req.query.category;
        const status = req.query.status;

        // Build query
        let query = { userId: req.user.id };
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        
        if (category) query.category = category;
        if (status) query.status = status;

        const skip = (page - 1) * limit;
        const total = await Module.countDocuments(query);

        const modules = await Module.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip(skip)
            .select('-content.originalContent') // Exclude large content
            .lean();

        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: modules,
            pagination: {
                currentPage: page,
                totalPages,
                totalModules: total,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching modules:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch modules",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/modules
// @desc    Create a new module
// @access  Private
router.post("/", protect, upload.single('file'), validateModule, async (req, res) => {
    try {
        const { title, description, category, tags } = req.body;
        let { content } = req.body;

        let parsedTags = [];
        if (tags) {
            parsedTags = typeof tags === 'string' ? 
                tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : 
                tags;
        }

        let fileContent = null;
        let filePath = null;

        if (req.file) {
            filePath = req.file.path;
            try {
                fileContent = await parseFileContent(filePath);
                console.log("📄 File parsed successfully:", req.file.originalname);
            } catch (parseError) {
                console.error("Error parsing file:", parseError);
                fs.unlinkSync(filePath);
                return res.status(400).json({
                    success: false,
                    message: "Failed to parse uploaded file",
                    error: parseError.message
                });
            }
        }

        const moduleContent = fileContent || content;

        if (!moduleContent || moduleContent.trim().length === 0) {
            if (filePath) fs.unlinkSync(filePath);
            return res.status(400).json({
                success: false,
                message: "Module content is required"
            });
        }

        console.log("🤖 Generating AI content for module:", title);

        let aiContent;
        try {
            aiContent = await generateLearningContent(moduleContent, { category });
        } catch (aiError) {
            console.error("AI content generation error:", aiError);
            if (filePath) fs.unlinkSync(filePath);
            return res.status(500).json({
                success: false,
                message: "Failed to generate learning content with AI",
                error: process.env.NODE_ENV === 'development' ? aiError.message : undefined
            });
        }

        const module = new Module({
            title,
            description,
            category: category || 'General',
            tags: parsedTags,
            userId: req.user.id,
            content: {
                originalContent: moduleContent,
                summary: aiContent.summary,
                concepts: aiContent.concepts,
                flashcards: aiContent.flashcards,
                quiz: aiContent.quiz
            },
            metadata: {
                wordCount: moduleContent.split(/\s+/).length,
                estimatedReadTime: Math.ceil(moduleContent.split(/\s+/).length / 200),
                aiModel: 'gemini-1.5-flash',
                contentSource: req.file ? 'file_upload' : 'text_input',
                originalFileName: req.file ? req.file.originalname : null
            }
        });

        await module.save();

        if (filePath) {
            try {
                fs.unlinkSync(filePath);
                console.log("🗑️ Cleaned up uploaded file:", filePath);
            } catch (cleanupError) {
                console.warn("Warning: Could not clean up uploaded file:", cleanupError);
            }
        }

        const moduleResponse = module.toObject();
        delete moduleResponse.content.originalContent;

        res.status(201).json({
            success: true,
            message: "Module created successfully",
            data: moduleResponse
        });

        console.log("✅ Module created successfully:", module._id);

    } catch (error) {
        console.error("Error creating module:", error);

        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.warn("Warning: Could not clean up uploaded file:", cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            message: "Failed to create module",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/modules/:id
// @desc    Get a specific module
// @access  Private
router.get("/:id", protect, async (req, res) => {
    try {
        const module = await Module.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                message: "Module not found"
            });
        }

        module.lastAccessed = new Date();
        await module.save();

        res.json({
            success: true,
            data: module
        });
    } catch (error) {
        console.error("Error fetching module:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch module",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PUT /api/modules/:id
// @desc    Update a module
// @access  Private
router.put("/:id", protect, validateModuleUpdate, async (req, res) => {
    try {
        const module = await Module.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                message: "Module not found"
            });
        }

        const { title, description, category, tags, status } = req.body;

        if (title !== undefined) module.title = title;
        if (description !== undefined) module.description = description;
        if (category !== undefined) module.category = category;
        if (status !== undefined) module.status = status;
        
        if (tags !== undefined) {
            module.tags = typeof tags === 'string' ? 
                tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : 
                tags;
        }

        module.version.number += 1;
        module.version.lastModified = new Date();
        module.version.changelog.push({
            version: module.version.number,
            changes: `Updated module metadata`,
            date: new Date()
        });

        await module.save();

        res.json({
            success: true,
            message: "Module updated successfully",
            data: module
        });
    } catch (error) {
        console.error("Error updating module:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update module",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   DELETE /api/modules/:id
// @desc    Delete a module
// @access  Private
router.delete("/:id", protect, async (req, res) => {
    try {
        const module = await Module.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                message: "Module not found"
            });
        }

        await Module.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Module deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting module:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete module",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;
        if (req.file) {
            if (req.file.mimetype === 'application/pdf') {
                const parsedText = await parsePDF(req.file.buffer);
                // Append parsed text to originalContent or use it as the main content
                originalContent = parsedText;
                if (!description) {
                    description = `Generated from ${req.file.originalname}`;
                }
            }
        }

        // Create initial module
        const module = new Module({
            user: req.user._id,
            title,
            description,
            originalContent,
            status: 'processing'
        });

        await module.save();

        // Generate AI content
        try {
            // Use originalContent (which might be from the file now)
            const aiContent = await generateModuleContent(originalContent || description);

            module.summary = aiContent.summary;
            module.concepts = aiContent.concepts;
            module.flashcards = aiContent.flashcards;
            module.quiz = aiContent.quiz;
            module.status = 'completed';

            await module.save();

            res.status(201).json(module);
        } catch (aiError) {
            console.error("AI Generation failed:", aiError);
            // If AI fails, we still return the module but with error status or just draft
            module.status = 'draft';
            await module.save();
            res.status(201).json(module); // Return the module anyway
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a module
// @route   DELETE /api/modules/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);

        if (module) {
            if (module.user.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }
            await Module.deleteOne({ _id: req.params.id });
            res.json({ message: 'Module removed' });
        } else {
            res.status(404).json({ message: 'Module not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
