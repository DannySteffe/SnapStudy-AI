import rateLimit from 'express-rate-limit';
import { slowDown } from 'express-slow-down';

// General API rate limiting
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/';
    }
});

// Strict rate limiting for authentication routes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 auth requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});

// Rate limiting for module creation (more resource intensive)
export const createModuleLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 module creations per hour
    message: {
        error: 'Too many modules created, please try again later.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// File upload rate limiting
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 uploads per hour
    message: {
        error: 'Too many file uploads, please try again later.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Speed limiting for heavy operations
export const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 2, // Allow 2 requests per 15 minutes without delay
    delayMs: 500, // Add 500ms delay per request after delayAfter
    maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// User-specific rate limiting based on JWT token
export const userRateLimiter = (maxRequests = 200, windowMs = 15 * 60 * 1000) => {
    const store = new Map();

    return (req, res, next) => {
        const userId = req.user?.id || req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;

        // Clean up old entries
        for (const [key, data] of store.entries()) {
            if (data.timestamp < windowStart) {
                store.delete(key);
            }
        }

        // Check current user's requests
        const userRequests = store.get(userId) || { count: 0, timestamp: now };

        if (userRequests.timestamp < windowStart) {
            userRequests.count = 1;
            userRequests.timestamp = now;
        } else {
            userRequests.count++;
        }

        store.set(userId, userRequests);

        if (userRequests.count > maxRequests) {
            return res.status(429).json({
                error: 'Too many requests for this user account.',
                retryAfter: Math.ceil((windowStart + windowMs - now) / 1000)
            });
        }

        next();
    };
};
