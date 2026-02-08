import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
    front: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, 'Flashcard front cannot exceed 500 characters']
    },
    back: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, 'Flashcard back cannot exceed 1000 characters']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: [String],
    stats: {
        timesReviewed: { type: Number, default: 0 },
        correctAnswers: { type: Number, default: 0 },
        lastReviewed: Date,
        nextReview: Date
    }
});

const quizQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, 'Question cannot exceed 1000 characters']
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function(options) {
                return options.length >= 2 && options.length <= 6;
            },
            message: 'Quiz must have between 2 and 6 options'
        }
    },
    correct: {
        type: Number,
        required: true,
        validate: {
            validator: function(correct) {
                return correct >= 0 && correct < this.options.length;
            },
            message: 'Correct answer index must be valid'
        }
    },
    explanation: {
        type: String,
        maxlength: [500, 'Explanation cannot exceed 500 characters']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    stats: {
        timesAsked: { type: Number, default: 0 },
        correctAnswers: { type: Number, default: 0 },
        averageTime: { type: Number, default: 0 } // in seconds
    }
});

const moduleSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: { 
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    
    // The raw content provided by the user (text or file extraction)
    originalContent: { 
        type: String,
        maxlength: [50000, 'Original content cannot exceed 50,000 characters']
    },

    // AI Generated Content
    summary: { 
        type: String,
        maxlength: [5000, 'Summary cannot exceed 5000 characters']
    },
    concepts: {
        type: [String],
        validate: {
            validator: function(concepts) {
                return concepts.length <= 50;
            },
            message: 'Cannot have more than 50 concepts'
        }
    },
    flashcards: [flashcardSchema],
    quiz: [quizQuestionSchema],

    // Module metadata
    status: {
        type: String,
        enum: ['draft', 'processing', 'completed', 'failed'],
        default: 'draft'
    },
    visibility: {
        type: String,
        enum: ['private', 'public', 'shared'],
        default: 'private'
    },
    tags: [String],
    category: {
        type: String,
        enum: ['science', 'technology', 'math', 'literature', 'history', 'language', 'business', 'other'],
        default: 'other'
    },
    
    // File information
    fileInfo: {
        originalName: String,
        mimeType: String,
        size: Number,
        uploadedAt: Date
    },
    
    // AI processing information
    aiProcessing: {
        model: String,
        processingTime: Number, // in milliseconds
        tokenUsage: {
            prompt: Number,
            completion: Number,
            total: Number
        },
        cost: Number,
        quality: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            default: 'good'
        }
    },
    
    // Learning statistics
    stats: {
        views: { type: Number, default: 0 },
        completions: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },
        studyTime: { type: Number, default: 0 }, // in minutes
        lastAccessed: Date
    },
    
    // Version control
    version: { type: Number, default: 1 },
    previousVersions: [{
        version: Number,
        createdAt: Date,
        summary: String,
        concepts: [String],
        flashcards: [flashcardSchema],
        quiz: [quizQuestionSchema]
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
moduleSchema.index({ user: 1, createdAt: -1 });
moduleSchema.index({ status: 1 });
moduleSchema.index({ user: 1, status: 1 });
moduleSchema.index({ visibility: 1, createdAt: -1 });
moduleSchema.index({ category: 1, visibility: 1 });
moduleSchema.index({ tags: 1 });
moduleSchema.index({ title: 'text', description: 'text', concepts: 'text' });

// Virtual properties
moduleSchema.virtual('flashcardCount').get(function() {
    return this.flashcards ? this.flashcards.length : 0;
});

moduleSchema.virtual('quizCount').get(function() {
    return this.quiz ? this.quiz.length : 0;
});

moduleSchema.virtual('conceptCount').get(function() {
    return this.concepts ? this.concepts.length : 0;
});

moduleSchema.virtual('difficulty').get(function() {
    if (!this.flashcards || this.flashcards.length === 0) return 'medium';
    
    const difficulties = this.flashcards.map(card => card.difficulty);
    const hardCount = difficulties.filter(d => d === 'hard').length;
    const easyCount = difficulties.filter(d => d === 'easy').length;
    
    if (hardCount > difficulties.length / 2) return 'hard';
    if (easyCount > difficulties.length / 2) return 'easy';
    return 'medium';
});

// Instance methods
moduleSchema.methods.updateStats = function(newViews, studyTime) {
    this.stats.views += newViews || 0;
    this.stats.studyTime += studyTime || 0;
    this.stats.lastAccessed = new Date();
    return this.save();
};

moduleSchema.methods.addRating = function(rating) {
    const currentTotal = this.stats.averageRating * this.stats.totalRatings;
    this.stats.totalRatings += 1;
    this.stats.averageRating = (currentTotal + rating) / this.stats.totalRatings;
    return this.save();
};

moduleSchema.methods.createVersion = function() {
    const newVersion = {
        version: this.version,
        createdAt: new Date(),
        summary: this.summary,
        concepts: [...this.concepts],
        flashcards: [...this.flashcards],
        quiz: [...this.quiz]
    };
    
    this.previousVersions.push(newVersion);
    this.version += 1;
    
    // Keep only last 5 versions
    if (this.previousVersions.length > 5) {
        this.previousVersions = this.previousVersions.slice(-5);
    }
    
    return this.save();
};

// Static methods
moduleSchema.statics.findPublic = function() {
    return this.find({ visibility: 'public', status: 'completed' });
};

moduleSchema.statics.findByCategory = function(category) {
    return this.find({ category, visibility: 'public', status: 'completed' });
};

// Pre-save middleware
moduleSchema.pre('save', function(next) {
    // Update lastAccessed when module is modified
    if (this.isModified() && !this.isNew) {
        this.stats.lastAccessed = new Date();
    }
    next();
});

// Post-save middleware
moduleSchema.post('save', async function(doc, next) {
    // Update user stats when module is completed
    if (doc.isModified('status') && doc.status === 'completed') {
        await mongoose.model('User').findByIdAndUpdate(
            doc.user,
            { $inc: { 'stats.modulesCreated': 1 } }
        );
    }
    next();
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;
