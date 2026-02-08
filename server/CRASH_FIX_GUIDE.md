# 🔧 Server Crash Fix Guide

## The Problem

`[nodemon] app crashed - waiting for file changes before starting...`

This means the original server.js file has syntax errors.

## ✅ Quick Solution

### Use the Clean Server File

Instead of the corrupted `server.js`, use the working `server-clean.js`:

```bash
node server-clean.js
```

### Update Your Scripts

Your package.json has been updated to use the clean version:

- `npm start` → runs `server-clean.js`
- `npm run dev` → runs `nodemon server-clean.js`

## 🚀 Step-by-Step Fix

1. **Open terminal in server directory**:

   ```bash
   cd "c:\Users\Administrator\Documents\SnapStudy AI\SnapStudy AI\server"
   ```

2. **Run the clean server**:

   ```bash
   node server-clean.js
   ```

3. **Expected output**:

   ```
   🚀 SnapStudy AI server running in DEVELOPMENT mode on http://127.0.0.1:3001
   📊 Health check: http://127.0.0.1:3001/health
   🧪 Running in DEVELOPMENT MODE - database disabled for testing
   ```

4. **Test the connection**:
   ```bash
   node test-connection.js
   ```

## 🎯 Alternative Startup Methods

### Method 1: Direct Node

```bash
node server-clean.js
```

### Method 2: NPM Start

```bash
npm start
```

### Method 3: Batch File

```bash
start-backend.bat
```

### Method 4: Development Mode (with auto-restart)

```bash
npm run dev
```

## 📊 Verify It's Working

1. **Health Check**: http://127.0.0.1:3001/health
2. **Root Endpoint**: http://127.0.0.1:3001/
3. **Registration Test**:
   ```bash
   curl -X POST http://127.0.0.1:3001/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

## 🐛 Still Having Issues?

If you see any errors, check:

1. Is port 3001 already in use? Try a different port
2. Are all dependencies installed? Run `npm install`
3. Is the .env file configured? Check environment variables

## 🎉 Success Indicators

✅ Server starts without crashes
✅ No syntax errors in console
✅ Health endpoint returns "healthy"
✅ Ready to accept frontend connections
