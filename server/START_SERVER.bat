@echo off
title SnapStudy AI - Backend Server
color 0A
echo.
echo 🚀 Starting SnapStudy AI Backend Server...
echo ==========================================
echo.

cd /d "c:\Users\Administrator\Documents\SnapStudy AI\SnapStudy AI\server"

echo 📂 Current directory: %CD%
echo ⚙️  Starting server on port 3001...
echo.
echo 🔥 Server will start in 3 seconds...
timeout /t 3

echo 🎯 Starting node quick-server.cjs
echo.
node quick-server.cjs

pause
