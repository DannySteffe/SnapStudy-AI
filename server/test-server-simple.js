const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration to avoid ad blockers
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        message: 'SnapStudy AI Server is running!',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'SnapStudy AI API Server', 
        status: 'active',
        endpoints: ['/health', '/api/auth/register', '/api/auth/login']
    });
});

// Test registration endpoint
app.post('/api/auth/register', (req, res) => {
    console.log('Registration attempt:', req.body);
    res.json({ 
        success: true, 
        message: 'User registered successfully (TEST MODE)',
        user: { 
            id: 'test-123', 
            name: req.body.name || 'Test User',
            email: req.body.email || 'test@example.com'
        }
    });
});

// Test login endpoint
app.post('/api/auth/login', (req, res) => {
    console.log('Login attempt:', req.body);
    res.json({ 
        success: true, 
        message: 'Login successful (TEST MODE)',
        token: 'test-jwt-token-123',
        user: { 
            id: 'test-123', 
            name: 'Test User',
            email: req.body.email || 'test@example.com'
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
    console.log('🚀 SnapStudy AI TEST server running on http://127.0.0.1:' + PORT);
    console.log('📊 Health check: http://127.0.0.1:' + PORT + '/health');
    console.log('🧪 Running in TEST MODE for application verification');
    console.log('✅ Server ready for frontend testing');
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
    console.log('Server shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Server interrupted, shutting down');
    process.exit(0);
});
