#!/usr/bin/env node

console.log("🧪 SnapStudy AI - Testing Server Functionality");
console.log("=" * 50);

// Test environment setup
if (process.env.NODE_ENV !== 'production') {
    console.log("📋 Environment: Development");
} else {
    console.log("📋 Environment: Production");
}

// Test basic server import
try {
    console.log("✅ Testing server imports...");
    
    // Test individual components
    const express = await import('express');
    console.log("✅ Express imported successfully");
    
    const cors = await import('cors');
    console.log("✅ CORS imported successfully");
    
    const dotenv = await import('dotenv');
    console.log("✅ Dotenv imported successfully");
    
    console.log("\n🚀 Starting SnapStudy AI Server...");
    console.log("📡 Server will be available at: http://localhost:5000");
    console.log("📊 Health check: http://localhost:5000/health");
    console.log("📚 API documentation: http://localhost:5000/api/docs");
    console.log("\n🔧 To test the complete system:");
    console.log("1. Open http://localhost:5000/health in your browser");
    console.log("2. Check API docs at http://localhost:5000/api/docs");
    console.log("3. Test user registration via API");
    console.log("\n👁️  Watch server logs below:\n");
    
} catch (error) {
    console.error("❌ Error testing imports:", error.message);
    process.exit(1);
}

// Import and start the actual server
try {
    await import('./server.js');
} catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
}
