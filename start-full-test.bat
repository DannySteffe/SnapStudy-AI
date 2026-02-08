@echo off
echo 🚀 Starting SnapStudy AI Application Test
echo =====================================

echo.
echo 📁 Current directory: %CD%

echo.
echo 🔧 Step 1: Starting Backend Server...
echo =====================================
cd server
start "Backend Server" cmd /k "node test-server-simple.js"
timeout /t 3

echo.
echo 🌐 Step 2: Testing Backend Health...
echo =====================================
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3001/health' -Method Get; Write-Host 'Backend Status:' $response.StatusCode; Write-Host 'Response:' $response.Content } catch { Write-Host 'Backend Error:' $_.Exception.Message }"

echo.
echo 🎨 Step 3: Starting Frontend Server...
echo =====================================
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ⏰ Waiting for servers to fully start...
timeout /t 5

echo.
echo 🌍 Step 4: Opening Application in Browser...
echo =====================================
start http://localhost:5173

echo.
echo ✅ Application Test Complete!
echo =====================================
echo 🔍 Check the opened browser windows:
echo    - Frontend: http://localhost:5173
echo    - Backend Health: http://127.0.0.1:3001/health
echo.
echo 🧪 Test the registration/login functionality
echo 📊 Both servers should be running in separate terminal windows
echo.
pause
