@echo off
echo 🚀 SnapStudy AI - Starting Complete System for Testing
echo =====================================================
echo.

echo 📡 Starting Backend Server (Port 5000)...
echo.
cd /d "c:\Users\Administrator\Documents\SnapStudy AI\SnapStudy AI\server"
start "SnapStudy Backend" cmd /k "npm start"

timeout /t 3 /nobreak >nul

echo 🖥️  Starting Frontend Development Server (Port 5173)...
echo.
cd /d "c:\Users\Administrator\Documents\SnapStudy AI\SnapStudy AI"
start "SnapStudy Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting in separate windows
echo.
echo 🌐 Frontend: http://localhost:5173
echo 📡 Backend: http://localhost:5000  
echo 📊 Health Check: http://localhost:5000/health
echo 📚 API Docs: http://localhost:5000/api/docs
echo.
echo ⏳ Please wait a moment for both servers to fully start...
echo.
pause
