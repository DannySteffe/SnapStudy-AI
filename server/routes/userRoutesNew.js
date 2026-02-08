import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { 
    validateUserRegistration, 
    validateUserLogin,
    validateObjectId,
    handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', authLimiter, validateUserRegistration, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email address' 
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            // Update user stats
            await User.findByIdAndUpdate(user._id, {
                $set: { lastLogin: new Date() }
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id),
                    isEmailVerified: user.isEmailVerified,
                    preferences: user.preferences,
                    stats: user.stats
                }
            });
        } else {
            res.status(400).json({ 
                success: false,
                message: 'Invalid user data' 
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `User with this ${field} already exists`
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: error.message || 'Server error during registration'
        });
    }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
router.post('/login', authLimiter, validateUserLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
            });
        }

        // Check password
        const isPasswordValid = await user.matchPassword(password);

        if (!isPasswordValid) {
            // Increment login attempts
            await user.incrementLoginAttempts();
            
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Reset login attempts on successful login
        if (user.loginAttempts > 0) {
            await user.resetLoginAttempts();
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, {
            $set: { lastLogin: new Date() }
        });

        // Return success response
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                isEmailVerified: user.isEmailVerified,
                preferences: user.preferences,
                stats: user.stats,
                lastLogin: new Date()
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login' 
        });
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                preferences: user.preferences,
                stats: user.stats,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error fetching profile' 
        });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, preferences } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Update allowed fields
        if (name && name !== user.name) {
            // Validate name
            if (name.length < 2 || name.length > 50) {
                return res.status(400).json({
                    success: false,
                    message: 'Name must be between 2 and 50 characters'
                });
            }
            user.name = name;
        }

        if (preferences) {
            user.preferences = { ...user.preferences, ...preferences };
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                stats: user.stats
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error updating profile' 
        });
    }
});

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await user.matchPassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error changing password' 
        });
    }
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const Module = mongoose.model('Module');
        
        const moduleCount = await Module.countDocuments({ 
            user: req.user._id 
        });
        const completedModules = await Module.countDocuments({ 
            user: req.user._id, 
            status: 'completed' 
        });

        res.json({
            success: true,
            data: {
                user: user.stats,
                modules: {
                    total: moduleCount,
                    completed: completedModules,
                    draft: moduleCount - completedModules
                },
                account: {
                    memberSince: user.createdAt,
                    lastLogin: user.lastLogin,
                    emailVerified: user.isEmailVerified
                }
            }
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error fetching statistics' 
        });
    }
});

// Legacy compatibility routes
// @desc    Register a new user (legacy)
// @route   POST /api/users
// @access  Public
router.post('/', async (req, res) => {
    console.log('⚠️ Warning: Using legacy registration endpoint. Please use /api/users/register instead.');
    
    try {
        const { name, email, password } = req.body;
        
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Legacy registration error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
