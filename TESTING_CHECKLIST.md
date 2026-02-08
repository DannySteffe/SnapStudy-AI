# 🧪 SnapStudy AI Application Testing Checklist

## 🚀 Getting Started

1. **Run the test script**: `start-full-test.bat`
2. **Check both servers are running**:
   - Backend: http://127.0.0.1:3001/health
   - Frontend: http://localhost:5173

## ✅ Backend Testing Checklist

### Basic Server Health

- [ ] ✅ Server starts without errors
- [ ] ✅ Health endpoint responds: http://127.0.0.1:3001/health
- [ ] ✅ Root endpoint responds: http://127.0.0.1:3001/
- [ ] ✅ CORS headers are properly configured

### API Endpoints Testing

- [ ] 📝 **Registration Test**: POST http://127.0.0.1:3001/api/auth/register
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }
  ```
- [ ] 🔐 **Login Test**: POST http://127.0.0.1:3001/api/auth/login
  ```json
  {
    "email": "test@example.com",
    "password": "testpass123"
  }
  ```

## 🎨 Frontend Testing Checklist

### Navigation & UI

- [ ] 🏠 **Landing Page**: Loads without errors
- [ ] 🧭 **Navigation**: All menu items work
- [ ] 🎨 **Styling**: Tailwind CSS loads properly
- [ ] 📱 **Responsive**: Works on different screen sizes

### Authentication Flow

- [ ] 📝 **Registration Page**:
  - Form validates input
  - Submits to backend
  - Shows success/error messages
- [ ] 🔐 **Login Page**:
  - Form validates input
  - Connects to backend
  - Redirects on success
- [ ] 🚪 **Logout**: Clears session and redirects

### Dashboard Features

- [ ] 📊 **Dashboard**: Loads after login
- [ ] 📚 **Module Creation**: Can create new modules
- [ ] 📄 **File Upload**: PDF upload functionality
- [ ] 🤖 **AI Integration**: Content generation works

## 🔧 Troubleshooting Common Issues

### Backend Issues

- **Port 3001 in use**: Change PORT in server file
- **CORS errors**: Check corsOptions in server
- **Module not found**: Run `npm install` in server directory

### Frontend Issues

- **White screen**: Check browser console for errors
- **API connection failed**: Verify backend is running on 3001
- **Build errors**: Run `npm install` in main directory

## 🌐 Network Testing

### Manual API Tests (use Postman or curl)

```bash
# Health Check
curl http://127.0.0.1:3001/health

# Registration Test
curl -X POST http://127.0.0.1:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login Test
curl -X POST http://127.0.0.1:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## 📊 Expected Results

### ✅ Successful Test Results:

1. **Backend**:
   - Health endpoint returns `{"status":"healthy"}`
   - Registration returns user object
   - No console errors

2. **Frontend**:
   - Page loads without white screen
   - Navigation works smoothly
   - Forms submit successfully
   - No network errors in browser console

3. **Integration**:
   - Frontend can register users via backend
   - Authentication flow works end-to-end
   - Dashboard loads with user data

## 🐛 If Tests Fail:

1. **Check server logs** in terminal windows
2. **Open browser console** (F12) to see frontend errors
3. **Verify environment variables** are loaded
4. **Confirm ports** 3001 (backend) and 5173 (frontend) are available
5. **Test individual components** separately

## 🎯 Success Criteria:

- ✅ Both servers start without errors
- ✅ Health check passes
- ✅ Frontend loads and displays properly
- ✅ User can navigate through the application
- ✅ Basic authentication flow works
- ✅ No critical console errors

**Status**: Ready for comprehensive testing! 🚀
