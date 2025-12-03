import express from 'express';
import Module from '../models/Module.js';

const router = express.Router();

// @desc    Get all modules
// @route   GET /api/modules
router.get('/', async (req, res) => {
    try {
        const modules = await Module.find({}).sort({ createdAt: -1 });
        res.json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single module
// @route   GET /api/modules/:id
router.get('/:id', async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (module) {
            res.json(module);
        } else {
            res.status(404).json({ message: 'Module not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a module
// @route   POST /api/modules
router.post('/', async (req, res) => {
    try {
        const { title, description, originalContent } = req.body;

        const module = new Module({
            title,
            description,
            originalContent,
            status: 'draft' // Initially draft, will be 'processing' when AI starts
        });

        const createdModule = await module.save();
        res.status(201).json(createdModule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
