import mongoose from 'mongoose';

const moduleSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    // The raw content provided by the user (text or file extraction)
    originalContent: { type: String },

    // AI Generated Content
    summary: { type: String },
    concepts: [{ type: String }],
    flashcards: [{
        front: String,
        back: String
    }],
    quiz: [{
        question: String,
        options: [String],
        correct: Number // Index of correct option
    }],

    status: {
        type: String,
        enum: ['draft', 'processing', 'completed'],
        default: 'draft'
    },
}, {
    timestamps: true,
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;
