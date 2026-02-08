// Environment validation script for .env.production
require('dotenv').config({ path: '.env.production' });

console.log('🔍 Environment Variables Validation\n');

// Required variables check
const requiredVars = {
    'NODE_ENV': process.env.NODE_ENV,
    'PORT': process.env.PORT,
    'MONGO_URI': process.env.MONGO_URI,
    'JWT_SECRET': process.env.JWT_SECRET,
    'GEMINI_API_KEY': process.env.GEMINI_API_KEY,
    'CLIENT_URL': process.env.CLIENT_URL
};

let allGood = true;

console.log('✅ REQUIRED VARIABLES:');
Object.entries(requiredVars).forEach(([key, value]) => {
    const status = value ? '✅' : '❌';
    const displayValue = value ? (key.includes('SECRET') || key.includes('KEY') ? '[HIDDEN]' : value) : 'MISSING';
    console.log(`${status} ${key}: ${displayValue}`);
    if (!value) allGood = false;
});

console.log('\n🔍 ISSUES TO FIX:');

// Check for placeholder values
const placeholders = [];
if (process.env.MONGO_URI && process.env.MONGO_URI.includes('<db_password>')) {
    placeholders.push('❌ MONGO_URI still contains <db_password> placeholder');
}
if (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('your-domain')) {
    placeholders.push('❌ CLIENT_URL still contains placeholder domain');
}
if (process.env.ALLOWED_ORIGINS && process.env.ALLOWED_ORIGINS.includes('your-domain')) {
    placeholders.push('❌ ALLOWED_ORIGINS still contains placeholder domains');
}

if (placeholders.length > 0) {
    placeholders.forEach(issue => console.log(issue));
    allGood = false;
} else {
    console.log('✅ No placeholder values found');
}

// Check secret lengths
console.log('\n🔐 SECRET KEY VALIDATION:');
const secrets = ['JWT_SECRET', 'SESSION_SECRET', 'COOKIE_SECRET'];
secrets.forEach(secretKey => {
    const secret = process.env[secretKey];
    if (secret) {
        const length = secret.length;
        const status = length >= 32 ? '✅' : '❌';
        console.log(`${status} ${secretKey}: ${length} characters ${length >= 32 ? '(Good)' : '(Too short - need 32+)'}`);
        if (length < 32) allGood = false;
    }
});

console.log('\n📊 SUMMARY:');
if (allGood) {
    console.log('🎉 All environment variables are properly configured!');
    console.log('✅ Ready for production deployment');
} else {
    console.log('⚠️  Some issues need to be fixed before deployment');
    console.log('\n📝 TODO:');
    console.log('1. Replace <db_password> with your actual MongoDB password');
    console.log('2. Update CLIENT_URL and ALLOWED_ORIGINS with your actual domain');
    console.log('3. Ensure all secrets are at least 32 characters long');
}

console.log('\n🔗 Useful links:');
console.log('- MongoDB Atlas: https://cloud.mongodb.com/');
console.log('- Google AI Studio: https://makersuite.google.com/app/apikey');
console.log('- Vercel Dashboard: https://vercel.com/dashboard');
