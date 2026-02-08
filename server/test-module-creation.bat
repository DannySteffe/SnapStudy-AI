@echo off
echo 🧪 Testing Module Creation Endpoint
echo =====================================
echo.

echo 🔍 Testing backend server health...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3001/health' -TimeoutSec 5; Write-Host '✅ Server Status:' $response.StatusCode } catch { Write-Host '❌ Server not running:' $_.Exception.Message; exit 1 }"

echo.
echo 📚 Testing module creation endpoint...
powershell -Command "try { $body = @{ title='Test Module'; description='Testing module creation'; originalContent='This is test content for the module.' } | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3001/api/modules' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 10; Write-Host '✅ Module Creation Status:' $response.StatusCode; Write-Host '📊 Response:' $response.Content.Substring(0, 100) '...' } catch { Write-Host '❌ Module creation failed:' $_.Exception.Message }"

echo.
echo 📖 Testing get modules endpoint...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3001/api/modules' -Method GET -TimeoutSec 5; Write-Host '✅ Get Modules Status:' $response.StatusCode } catch { Write-Host '❌ Get modules failed:' $_.Exception.Message }"

echo.
echo 🎯 Test Results Summary:
echo ========================
echo ✅ If all tests show status 200, your module creation is working!
echo ❌ If any test fails, check if the server is running properly
echo 💡 Start server with: START_SERVER.bat
echo 🌐 Test in browser: Create a new module from the dashboard
echo.
pause
