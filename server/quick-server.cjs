const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', port: PORT, message: 'Backend is running!' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'SnapStudy AI Backend API', status: 'active' });
});

// Registration endpoint (the one failing)
app.post('/api/users/register', (req, res) => {
    console.log('📝 Registration request received:', req.body);
    res.json({
        success: true,
        message: 'User registered successfully!',
        user: {
            id: 'test-' + Date.now(),
            name: req.body.name || 'Test User',
            email: req.body.email || 'test@example.com'
        },
        token: 'test-jwt-token-' + Date.now()
    });
});

// Alternative registration endpoint
app.post('/api/auth/register', (req, res) => {
    console.log('📝 Auth registration request received:', req.body);
    res.json({
        success: true,
        message: 'User registered successfully via auth endpoint!',
        user: {
            id: 'test-' + Date.now(),
            name: req.body.name || 'Test User',
            email: req.body.email || 'test@example.com'
        },
        token: 'test-jwt-token-' + Date.now()
    });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    console.log('🔐 Login request received:', req.body);
    res.json({
        success: true,
        message: 'Login successful!',
        user: {
            id: 'test-123',
            name: 'Test User',
            email: req.body.email || 'test@example.com'
        },
        token: 'test-jwt-token-' + Date.now()
    });
});

// Module creation endpoint - THE MISSING ENDPOINT!
app.post('/api/modules', (req, res) => {
    console.log('📚 Module creation request received:', req.body);
    
    // Simulate AI processing
    const moduleData = {
        id: 'module-' + Date.now(),
        title: req.body.title || 'New Module',
        description: req.body.description || 'AI-generated learning module',
        originalContent: req.body.originalContent || req.body.content,
        
        // Simulated AI-generated content
        summary: {
            overview: "This module covers the key concepts and provides comprehensive learning materials.",
            keyPoints: [
                "Understanding core principles",
                "Practical applications", 
                "Advanced concepts",
                "Real-world examples"
            ],
            duration: "15-20 minutes",
            difficulty: "Intermediate"
        },
        
        concepts: [
            {
                id: 'concept-1',
                title: 'Core Concept 1',
                definition: 'A fundamental principle in this subject area.',
                explanation: 'This concept forms the foundation for understanding more advanced topics.',
                examples: ['Example 1', 'Example 2']
            },
            {
                id: 'concept-2', 
                title: 'Core Concept 2',
                definition: 'An important secondary concept that builds on the first.',
                explanation: 'This extends the basic understanding into practical applications.',
                examples: ['Application A', 'Application B']
            }
        ],
        
        flashcards: [
            {
                id: 'card-1',
                front: 'What is the main principle discussed in this module?',
                back: 'The core concept that forms the foundation of understanding.',
                difficulty: 'easy'
            },
            {
                id: 'card-2',
                front: 'How does the secondary concept relate to the first?',
                back: 'It builds upon and extends the foundational knowledge into practical use.',
                difficulty: 'medium'
            },
            {
                id: 'card-3',
                front: 'What are the key applications mentioned?',
                back: 'Real-world scenarios where these concepts are applied effectively.',
                difficulty: 'medium'
            }
        ],
        
        quiz: {
            questions: [
                {
                    id: 'q1',
                    question: 'Which statement best describes the core concept?',
                    options: [
                        'A fundamental principle in this subject area',
                        'An optional consideration',
                        'A complex theory with no applications',
                        'A outdated methodology'
                    ],
                    correctAnswer: 0,
                    explanation: 'The core concept is indeed fundamental to understanding the subject.'
                },
                {
                    id: 'q2',
                    question: 'What is the estimated time to complete this module?',
                    options: [
                        '5-10 minutes',
                        '15-20 minutes', 
                        '30-45 minutes',
                        '1-2 hours'
                    ],
                    correctAnswer: 1,
                    explanation: 'This module is designed to be completed in 15-20 minutes.'
                },
                {
                    id: 'q3',
                    question: 'The secondary concept primarily focuses on:',
                    options: [
                        'Theoretical frameworks',
                        'Historical context',
                        'Practical applications',
                        'Mathematical proofs'
                    ],
                    correctAnswer: 2,
                    explanation: 'The secondary concept extends understanding into practical applications.'
                }
            ],
            passingScore: 70,
            timeLimit: 300 // 5 minutes
        },
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'completed'
    };
    
    res.json({
        success: true,
        message: 'Module created successfully!',
        module: moduleData
    });
});

// Get modules endpoint
app.get('/api/modules', (req, res) => {
    console.log('📚 Get modules request received');
    res.json({
        success: true,
        modules: [
            {
                id: 'sample-module-1',
                title: 'Sample Learning Module',
                description: 'A demonstration module with AI-generated content',
                createdAt: new Date().toISOString(),
                status: 'completed'
            }
        ]
    });
});

// Get single module endpoint
app.get('/api/modules/:id', (req, res) => {
    console.log('📚 Get single module request:', req.params.id);
    
    // Return sample module data
    const moduleData = {
        id: req.params.id,
        title: 'Sample Learning Module',
        description: 'Detailed module with all learning components',
        summary: {
            overview: "This is a sample module showing all features.",
            keyPoints: ["Sample concept 1", "Sample concept 2", "Sample application"],
            duration: "15 minutes",
            difficulty: "Beginner"
        },
        concepts: [
            {
                id: 'concept-1',
                title: 'Sample Concept',
                definition: 'A demonstration concept for testing.',
                explanation: 'This shows how concepts are structured.',
                examples: ['Example 1', 'Example 2']
            }
        ],
        flashcards: [
            {
                id: 'card-1',
                front: 'What is this module about?',
                back: 'It demonstrates the module structure and features.',
                difficulty: 'easy'
            }
        ],
        quiz: {
            questions: [
                {
                    id: 'q1',
                    question: 'This is a sample question?',
                    options: ['Yes', 'No', 'Maybe', 'Always'],
                    correctAnswer: 0,
                    explanation: 'Yes, this is indeed a sample question for testing.'
                }
            ],
            passingScore: 70,
            timeLimit: 300
        },
        createdAt: new Date().toISOString(),
        status: 'completed'
    };
    
    res.json({
        success: true,
        module: moduleData
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log('🚀 SnapStudy AI Backend Server Started Successfully!');
    console.log('📍 Server running on: http://127.0.0.1:' + PORT);
    console.log('🏥 Health check: http://127.0.0.1:' + PORT + '/health');
    console.log('📝 Registration endpoint: http://127.0.0.1:' + PORT + '/api/users/register');
    console.log('📚 Module creation: http://127.0.0.1:' + PORT + '/api/modules');
    console.log('🔐 Authentication: http://127.0.0.1:' + PORT + '/api/auth/*');
    console.log('✅ Server ready to accept connections');
    console.log('');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('❌ Port 3001 is already in use. Trying port 3002...');
        app.listen(3002, '127.0.0.1', () => {
            console.log('🚀 Server started on port 3002 instead');
        });
    } else {
        console.error('❌ Server error:', err);
    }
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
