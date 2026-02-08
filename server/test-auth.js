import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5000/api';

// Test authentication system
async function testAuthentication() {
    console.log('🧪 Testing SnapStudy AI Authentication System\n');

    try {
        // Test 1: Register a new user
        console.log('1. Testing user registration...');
        const registerResponse = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123'
            })
        });

        if (registerResponse.ok) {
            const userData = await registerResponse.json();
            console.log('✅ Registration successful');
            console.log(`   User ID: ${userData._id}`);
            console.log(`   Name: ${userData.name}`);
            console.log(`   Token: ${userData.token.substring(0, 20)}...`);
            
            // Test 2: Access protected route
            console.log('\n2. Testing protected route access...');
            const profileResponse = await fetch(`${API_BASE}/users/profile`, {
                headers: { 
                    'Authorization': `Bearer ${userData.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (profileResponse.ok) {
                const profile = await profileResponse.json();
                console.log('✅ Protected route access successful');
                console.log(`   Profile: ${profile.name} (${profile.email})`);
            } else {
                console.log('❌ Protected route access failed');
                console.log(`   Status: ${profileResponse.status}`);
            }

            // Test 3: Login with same credentials
            console.log('\n3. Testing user login...');
            const loginResponse = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    password: 'password123'
                })
            });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                console.log('✅ Login successful');
                console.log(`   Token: ${loginData.token.substring(0, 20)}...`);
            } else {
                console.log('❌ Login failed');
                console.log(`   Status: ${loginResponse.status}`);
            }

        } else {
            const errorData = await registerResponse.json();
            console.log('❌ Registration failed');
            console.log(`   Error: ${errorData.message}`);
            console.log(`   Status: ${registerResponse.status}`);
        }

        // Test 4: Test invalid credentials
        console.log('\n4. Testing invalid login...');
        const invalidLoginResponse = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'invalid@example.com',
                password: 'wrongpassword'
            })
        });

        if (!invalidLoginResponse.ok) {
            console.log('✅ Invalid login properly rejected');
        } else {
            console.log('❌ Invalid login should have been rejected');
        }

        // Test 5: Test unauthorized access
        console.log('\n5. Testing unauthorized access...');
        const unauthorizedResponse = await fetch(`${API_BASE}/users/profile`);
        
        if (!unauthorizedResponse.ok) {
            console.log('✅ Unauthorized access properly blocked');
        } else {
            console.log('❌ Unauthorized access should have been blocked');
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Server might not be running. Please start the server with:');
            console.log('   npm run dev');
        }
    }
}

// Test database connection
async function testDatabase() {
    console.log('\n📊 Testing Database Connection...');
    
    try {
        const mongoose = await import('mongoose');
        await mongoose.default.connect(process.env.MONGO_URI);
        console.log('✅ Database connection successful');
        await mongoose.default.disconnect();
    } catch (error) {
        console.log('❌ Database connection failed:', error.message);
        console.log('\n💡 Make sure MongoDB is running or check MONGO_URI in .env');
    }
}

// Run tests
async function runAllTests() {
    await testDatabase();
    console.log('\n' + '='.repeat(50));
    await testAuthentication();
    console.log('\n🎉 Authentication tests completed!');
}

runAllTests();
