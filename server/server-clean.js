import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

console.log("🔧 Starting SnapStudy AI server...");

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// CORS configuration for development
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://localhost:3001",
        ];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS allowed origin: ${origin}`);
            callback(null, true); // Allow all for development
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple test routes (no database required) - Using alternative endpoints to avoid ad blockers
app.post("/api/auth/signup", (req, res) => {
    console.log("📝 Registration attempt (auth/signup):", req.body);
    res.json({
        success: true,
        message: "Registration successful! (Development mode)",
        data: {
            user: {
                _id: "dev-user-123",
                name: req.body.name || "Test User",
                email: req.body.email || "test@example.com",
                isVerified: true
            },
            token: "dev-jwt-token-123"
        }
    });
});

app.post("/api/auth/signin", (req, res) => {
    console.log("🔐 Login attempt (auth/signin):", req.body);
    res.json({
        success: true,
        message: "Login successful! (Development mode)",
        data: {
            token: "dev-jwt-token-123",
            user: {
                _id: "dev-user-123",
                name: "Test User",
                email: req.body.email || "test@example.com",
                isVerified: true
            }
        }
    });
});

// Keep original endpoints as fallback
app.post("/api/users/register", (req, res) => {
    console.log("📝 Registration attempt (users/register):", req.body);
    res.json({
        success: true,
        message: "Registration successful! (Development mode - fallback)",
        data: {
            user: {
                _id: "dev-user-123",
                name: req.body.name || "Test User",
                email: req.body.email || "test@example.com",
                isVerified: true
            },
            token: "dev-jwt-token-123"
        }
    });
});

app.post("/api/users/login", (req, res) => {
    console.log("🔐 Login attempt (users/login):", req.body);
    res.json({
        success: true,
        message: "Login successful! (Development mode - fallback)",
        data: {
            token: "dev-jwt-token-123",
            user: {
                _id: "dev-user-123",
                name: "Test User",
                email: req.body.email || "test@example.com",
                isVerified: true
            }
        }
    });
});

app.get("/api/modules", (req, res) => {
    console.log("📚 Modules request");
    res.json({
        success: true,
        data: [
            {
                _id: "dev-module-1",
                title: "Sample Module",
                description: "This is a test module",
                category: "General",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalModules: 1,
            hasNextPage: false,
            hasPrevPage: false,
            limit: 10
        }
    });
});

app.post("/api/modules", (req, res) => {
    console.log("📝 Create module attempt:", req.body);
    res.json({
        success: true,
        message: "Module created successfully! (Development mode)",
        data: {
            _id: "dev-module-new",
            title: req.body.title || "New Module",
            description: req.body.description || "Test description",
            category: req.body.category || "General",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        environment: "development",
        mode: "testing",
        database: "disabled for testing"
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "SnapStudy AI Backend API - Development Mode",
        status: "operational",
        version: "1.0.0-dev",
        environment: "development",
        database: "disabled for testing"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "Something went wrong (development mode)"
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'API endpoint not found',
        path: req.originalUrl
    });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 SnapStudy AI server running in DEVELOPMENT mode on http://127.0.0.1:${PORT}`);
    console.log(`📊 Health check: http://127.0.0.1:${PORT}/health`);
    console.log(`📝 Test registration: POST http://127.0.0.1:${PORT}/api/users/register`);
    console.log(`📝 Alternative signup: POST http://127.0.0.1:${PORT}/api/auth/signup`);
    console.log(`🔐 Test login: POST http://127.0.0.1:${PORT}/api/users/login`);
    console.log(`📚 Test modules: GET http://127.0.0.1:${PORT}/api/modules`);
    console.log("🧪 Running in DEVELOPMENT MODE - database disabled for testing");
    console.log("🛡️  Using 127.0.0.1 to avoid ad blocker issues");
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('💤 Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('💤 Process terminated');
        process.exit(0);
    });
});

export default app;
