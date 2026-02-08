# 🔧 Ad Blocker Fix Guide

## The Problem

`ERR_BLOCKED_BY_CLIENT` means your ad blocker is blocking API requests to your local server.

## ✅ Quick Solutions

### Option 1: Update Frontend API URL

Update your frontend to use the new server address:

- **Old**: `http://localhost:5000`
- **New**: `http://127.0.0.1:3001`

### Option 2: Whitelist in Ad Blocker

1. **uBlock Origin**: Click the shield icon → Disable on `localhost`
2. **AdBlock Plus**: Click icon → "Don't run on this page"
3. **Brave Browser**: Click shield icon → Turn off shields

### Option 3: Use Alternative Endpoints

The server now supports both:

- `/api/users/register` (original)
- `/api/auth/signup` (alternative to avoid blockers)

### Option 4: Temporary Browser Fix

Open Chrome/Edge with disabled security:

```bash
chrome.exe --disable-web-security --user-data-dir="C:\temp\chrome_dev"
```

## 🧪 Test Your Fix

1. **Start the server** (it now runs on port 3001):

   ```bash
   node server.js
   ```

2. **Check health endpoint**: http://127.0.0.1:3001/health

3. **Test registration manually**:
   ```bash
   curl -X POST http://127.0.0.1:3001/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

## 🎯 Expected Result

✅ Server starts on `http://127.0.0.1:3001`
✅ Health check returns status: "healthy"
✅ Registration works without errors
✅ No more `ERR_BLOCKED_BY_CLIENT` errors

## 📞 Still Having Issues?

- Try a different browser (Firefox, Safari)
- Use browser incognito/private mode
- Check browser developer console for more details
