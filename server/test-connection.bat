@echo off
echo 🔍 Testing Backend Server Connection...
echo.

echo Attempting to connect to http://127.0.0.1:3001/health
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3001/health' -TimeoutSec 5; Write-Host '✅ Server Status:' $response.StatusCode; Write-Host '📊 Response:' $response.Content } catch { Write-Host '❌ Connection failed:' $_.Exception.Message }"

echo.
echo Attempting to connect to http://127.0.0.1:3001/
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3001/' -TimeoutSec 5; Write-Host '✅ Root endpoint:' $response.StatusCode; Write-Host '📊 Response:' $response.Content } catch { Write-Host '❌ Connection failed:' $_.Exception.Message }"

echo.
echo 🚀 If both tests fail, the server is not running.
echo 💡 Try running: node quick-server.js
pause
