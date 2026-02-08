# SnapStudy AI - System Test & Startup Guide

## 🚀 Quick Start Test

### Backend Server (Port 5000)

```bash
cd "c:\Users\Administrator\Documents\SnapStudy AI\SnapStudy AI\server"
npm start
```

### Frontend Development Server (Port 5173)

```bash
cd "c:\Users\Administrator\Documents\SnapStudy AI\SnapStudy AI"
npm run dev
```

## 🧪 API Testing Endpoints

### Health Check

```
GET http://localhost:5000/health
```

Expected: System status with database and service information

### API Documentation

```
GET http://localhost:5000/api/docs
```

Expected: Complete API documentation

### User Registration Test

```
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
}
```

### User Login Test

```
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "SecurePass123!"
}
```

### Module Creation Test (Requires Auth Token)

```
POST http://localhost:5000/api/modules
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "title": "Test Module",
    "description": "Testing AI content generation",
    "category": "Technology",
    "content": "Artificial intelligence is transforming education through personalized learning experiences."
}
```

## 🌐 Frontend Testing

1. **Landing Page**: http://localhost:5173
2. **Login/Register**: Test authentication flow
3. **Dashboard**: Create and manage modules
4. **Module Details**: View AI-generated content
5. **File Upload**: Test PDF/document processing

## 📱 Mobile Testing

Test responsive design at different screen sizes:

- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

## 🔍 Development Tools

### Database Connection (MongoDB)

- Ensure MONGODB_URI is set in .env
- Check database health at /health endpoint

### AI Integration (Google Gemini)

- Ensure GEMINI_API_KEY is set in .env
- Test content generation with module creation

### File Processing

- Test PDF upload functionality
- Verify file parsing and content extraction

## 🐛 Troubleshooting

### Common Issues:

1. **Port conflicts**: Change ports in .env if needed
2. **Database connection**: Verify MongoDB URI
3. **API key issues**: Check Google Gemini API key
4. **CORS errors**: Verify CLIENT_URL in server .env

### Log Locations:

- Server logs: Console output
- Error logs: server/output.log
- Database logs: MongoDB connection status

## 🎯 Success Criteria

✅ Server starts on port 5000
✅ Frontend starts on port 5173  
✅ Health endpoint returns "healthy"
✅ User can register/login
✅ Modules can be created with AI content
✅ File upload works correctly
✅ All API endpoints respond properly

## 🚀 Production Deployment Ready

After successful testing, the system is ready for deployment using:

- Docker containers
- Vercel/Netlify hosting
- MongoDB Atlas database
- Environment variable configuration
