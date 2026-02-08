// Quick environment validation
require('dotenv').config({ path: '.env.production' });

console.log('🔍 ENVIRONMENT VALIDATION REPORT\n');

// Check all required variables
const checks = [
    { name: 'NODE_ENV', value: process.env.NODE_ENV, required: true },
    { name: 'PORT', value: process.env.PORT, required: true },
    { name: 'MONGO_URI', value: process.env.MONGO_URI, required: true },
    { name: 'JWT_SECRET', value: process.env.JWT_SECRET, required: true },
    { name: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY, required: true },
    { name: 'CLIENT_URL', value: process.env.CLIENT_URL, required: true },
    { name: 'SESSION_SECRET', value: process.env.SESSION_SECRET, required: false },
    { name: 'COOKIE_SECRET', value: process.env.COOKIE_SECRET, required: false }
];

let issues = [];

console.log('✅ REQUIRED VARIABLES:');
checks.forEach(check => {
    const exists = !!check.value;
    const status = exists ? '✅' : (check.required ? '❌' : '⚠️');
    const display = exists ? (check.name.includes('SECRET') || check.name.includes('KEY') || check.name.includes('URI') ? '[SET]' : check.value) : 'MISSING';
    
    console.log(`${status} ${check.name}: ${display}`);
    
    if (check.required && !exists) {
        issues.push(`Missing required variable: ${check.name}`);
    }
});

// Check for placeholders
console.log('\n🔍 PLACEHOLDER CHECK:');
const placeholderChecks = [
    { var: 'MONGO_URI', placeholder: '<db_password>' },
    { var: 'CLIENT_URL', placeholder: 'your-domain' },
    { var: 'ALLOWED_ORIGINS', placeholder: 'your-domain' }
];

placeholderChecks.forEach(check => {
    const value = process.env[check.var];
    if (value && value.includes(check.placeholder)) {
        console.log(`❌ ${check.var} contains placeholder: ${check.placeholder}`);
        issues.push(`${check.var} still has placeholder values`);
    } else if (value) {
        console.log(`✅ ${check.var} properly configured`);
    }
});

// Check secret lengths
console.log('\n🔐 SECRET LENGTH CHECK:');
const secrets = ['JWT_SECRET', 'SESSION_SECRET', 'COOKIE_SECRET'];
secrets.forEach(secretName => {
    const secret = process.env[secretName];
    if (secret) {
        const length = secret.length;
        const status = length >= 32 ? '✅' : '❌';
        console.log(`${status} ${secretName}: ${length} chars ${length >= 32 ? '(Good)' : '(Too short)'}`);
        if (length < 32) {
            issues.push(`${secretName} is too short (${length} chars, need 32+)`);
        }
    }
});

// Final summary
console.log('\n📊 SUMMARY:');
if (issues.length === 0) {
    console.log('🎉 ALL CHECKS PASSED!');
    console.log('✅ Your .env.production file is ready for deployment');
} else {
    console.log(`⚠️  Found ${issues.length} issue(s):`);
    issues.forEach((issue, i) => console.log(`${i + 1}. ${issue}`));
}

console.log('\n🚀 DEPLOYMENT STATUS:');
const prodReady = !process.env.MONGO_URI?.includes('<db_password>') && 
                  !process.env.CLIENT_URL?.includes('your-domain') &&
                  process.env.JWT_SECRET?.length >= 32;

if (prodReady) {
    console.log('✅ READY FOR PRODUCTION DEPLOYMENT');
} else {
    console.log('⚠️  NEEDS UPDATES BEFORE DEPLOYMENT');
    console.log('   - Update CLIENT_URL with your actual domain after deployment');
}
