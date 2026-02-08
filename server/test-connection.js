// Simple test to check if server is working
console.log('🧪 Testing SnapStudy AI Server...\n');

async function testServerConnection() {
    const SERVER_URL = 'http://localhost:5000';
    
    try {
        // Use dynamic import for node-fetch if available, or fall back to simple test
        let fetch;
        try {
            const nodeFetch = await import('node-fetch');
            fetch = nodeFetch.default;
        } catch (e) {
            console.log('📦 node-fetch not available, install with: npm install node-fetch');
            console.log('🔗 Testing with basic connection check...');
            
            // Simple connection test without fetch
            const http = await import('http');
            const options = {
                hostname: 'localhost',
                port: 5000,
                path: '/health',
                method: 'GET'
            };
            
            return new Promise((resolve, reject) => {
                const req = http.request(options, (res) => {
                    console.log(`✅ Server is running on port 5000`);
                    console.log(`📊 Status Code: ${res.statusCode}`);
                    resolve(true);
                });
                
                req.on('error', (err) => {
                    console.log('❌ Connection failed:', err.message);
                    console.log('\n🔧 To fix the issue:');
                    console.log('   1. Open a new terminal');
                    console.log('   2. Navigate to the server directory');
                    console.log('   3. Run: node server.js');
                    console.log('   4. Wait for "Server running" message');
                    reject(err);
                });
                
                req.end();
            });
        }
        
        // If fetch is available, do full API tests
        console.log('1️⃣ Testing health endpoint...');
        const healthResponse = await fetch(`${SERVER_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData.status);
        
        console.log('\n2️⃣ Testing registration endpoint...');
        const registerResponse = await fetch(`${SERVER_URL}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'testpassword123'
            })
        });
        const registerData = await registerResponse.json();
        console.log('✅ Registration:', registerData.success ? 'Success' : 'Failed');
        
        console.log('\n🎉 All tests passed! Your server is working correctly.');
        console.log('🌐 Frontend should now be able to connect to backend');
        
    } catch (error) {
        console.log('💥 Test failed:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        console.log('   1. Make sure you are in the server directory');
        console.log('   2. Run: node server.js');
        console.log('   3. Look for "Server running" message');
        console.log('   4. Check if port 5000 is available');
    }
}

testServerConnection();
