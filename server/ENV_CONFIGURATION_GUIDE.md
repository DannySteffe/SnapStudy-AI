# 🔧 Environment Variables Configuration Guide

## 📋 Required vs Optional Variables

### ✅ **REQUIRED** (Must be configured before deployment)

```bash
# Core Application
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/snapai?retryWrites=true&w=majority
JWT_SECRET=your-production-jwt-secret-key-minimum-32-characters-long

# AI Service
GEMINI_API_KEY=your-gemini-api-key-here

# Security
CLIENT_URL=https://your-domain.vercel.app
```

### 🔶 **RECOMMENDED** (Has sensible defaults but should be customized)

```bash
# JWT Configuration
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://your-domain.netlify.app
```

### 🔸 **OPTIONAL** (System will use defaults if not specified)

```bash
# Logging
LOG_LEVEL=info
LOG_FORMAT=combined

# Database Pool
DB_MAX_POOL_SIZE=10
DB_MIN_POOL_SIZE=5

# Performance
COMPRESSION_LEVEL=6
CACHE_TTL=3600
```

## 🎯 Deployment-Specific Instructions

### **For Vercel Deployment**

Add these in your Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable one by one:
   - `NODE_ENV` → `production`
   - `MONGO_URI` → `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` → `generate_strong_32char_secret`
   - `GEMINI_API_KEY` → `your_gemini_api_key`
   - `CLIENT_URL` → `https://your-app.vercel.app`

### **For Railway/Render/Heroku**

Add via CLI or dashboard:

```bash
# Example for Railway
railway variables set NODE_ENV=production
railway variables set MONGO_URI="mongodb+srv://..."
```

### **For Docker**

Create `.env.production` and use with Docker:

```bash
docker run --env-file .env.production your-app
```

## 🔐 Security Best Practices

### **JWT_SECRET Generation**

```bash
# Generate a secure secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **MongoDB Atlas Setup**

1. Create cluster at mongodb.com
2. Add your IP to whitelist (or 0.0.0.0/0 for production)
3. Create database user with read/write permissions
4. Get connection string from "Connect" → "Connect your application"

### **Gemini API Key**

1. Visit https://makersuite.google.com/app/apikey
2. Create new API key
3. Restrict to specific APIs if needed
4. Add to environment variables

## 📝 Environment File Template

### **Development (.env)**

```bash
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://localhost:27017/snapai
JWT_SECRET=dev-secret-key-not-for-production
GEMINI_API_KEY=your-dev-api-key
CLIENT_URL=http://localhost:5173
```

### **Production (.env.production)**

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/snapai?retryWrites=true&w=majority
JWT_SECRET=production-secret-32-chars-minimum
GEMINI_API_KEY=your-production-api-key
CLIENT_URL=https://your-domain.vercel.app
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://your-backup-domain.netlify.app
```

## 🧪 Testing Your Configuration

### **Quick Test Script**

```bash
node -e "
require('dotenv').config({ path: '.env.production' });
console.log('✅ Environment loaded');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
"
```

### **Validate Required Variables**

```bash
node -e "
require('dotenv').config({ path: '.env.production' });
const required = ['NODE_ENV', 'MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.log('❌ Missing required variables:', missing);
  process.exit(1);
} else {
  console.log('✅ All required variables are set');
}
"
```

## 🚨 Common Issues

### **Issue: JWT_SECRET too short**

```
Error: JWT secret must be at least 32 characters long
```

**Solution**: Generate longer secret using crypto

### **Issue: MongoDB connection failed**

```
Error: connection <monitor> to xxx.mongodb.net:27017 closed
```

**Solution**: Check connection string, whitelist IP, verify credentials

### **Issue: CORS errors in production**

```
Error: Access to fetch blocked by CORS policy
```

**Solution**: Update CLIENT_URL and ALLOWED_ORIGINS to match your domain

## 📚 Additional Resources

- [MongoDB Atlas Setup Guide](https://docs.atlas.mongodb.com/getting-started/)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Environment Variables Security](https://12factor.net/config)
