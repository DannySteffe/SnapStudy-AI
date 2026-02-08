import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Error handler for validation results
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errorMessages
        });
    }
    next();
};

// User validation rules
export const validateUserRegistration = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
        
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage('Email is too long'),
        
    body('password')
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be between 6 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
        
    handleValidationErrors
];

export const validateUserLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
        
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ max: 128 })
        .withMessage('Password is too long'),
        
    handleValidationErrors
];

// Module validation rules
export const validateModuleCreation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
        
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
        
    body('originalContent')
        .optional()
        .isLength({ max: 50000 })
        .withMessage('Content cannot exceed 50,000 characters'),
        
    body('category')
        .optional()
        .isIn(['science', 'technology', 'math', 'literature', 'history', 'language', 'business', 'other'])
        .withMessage('Invalid category'),
        
    body('visibility')
        .optional()
        .isIn(['private', 'public', 'shared'])
        .withMessage('Invalid visibility setting'),
        
    handleValidationErrors
];

export const validateModuleUpdate = [
    param('id')
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid module ID');
            }
            return true;
        }),
        
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
        
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
        
    handleValidationErrors
];

// Query validation
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
        
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
        .toInt(),
        
    query('sortBy')
        .optional()
        .isIn(['createdAt', 'updatedAt', 'title', 'status'])
        .withMessage('Invalid sort field'),
        
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
        
    handleValidationErrors
];

// File upload validation
export const validateFileUpload = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }
    
    const allowedMimeTypes = ['application/pdf'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only PDF files are allowed.'
        });
    }
    
    if (req.file.size > maxFileSize) {
        return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 10MB.'
        });
    }
    
    next();
};

// MongoDB ObjectId validation
export const validateObjectId = (paramName) => [
    param(paramName)
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(`Invalid ${paramName}`);
            }
            return true;
        }),
    handleValidationErrors
];

// Search validation
export const validateSearch = [
    query('q')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters'),
        
    query('category')
        .optional()
        .isIn(['science', 'technology', 'math', 'literature', 'history', 'language', 'business', 'other'])
        .withMessage('Invalid category'),
        
    handleValidationErrors
];

// Custom sanitization middleware
export const sanitizeInput = (req, res, next) => {
    // Remove any potential script tags from string inputs
    const sanitizeString = (str) => {
        if (typeof str === 'string') {
            return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
        return str;
    };
    
    // Recursively sanitize object properties
    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            } else if (typeof obj[key] === 'string') {
                obj[key] = sanitizeString(obj[key]);
            }
        }
    };
    
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
    
    next();
};
