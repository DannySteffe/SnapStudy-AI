# SnapStudy AI Server Startup Script
Write-Host "🚀 Starting SnapStudy AI Backend Server..." -ForegroundColor Green
Write-Host "📍 Current Directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host "📋 Checking Node.js version..."

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "✅ Package.json found" -ForegroundColor Green
} else {
    Write-Host "❌ Package.json not found! Are you in the server directory?" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Check if server.js exists
if (Test-Path "server.js") {
    Write-Host "✅ Server.js found" -ForegroundColor Green
} else {
    Write-Host "❌ Server.js not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "📦 Installing dependencies (if needed)..."
npm install --silent

Write-Host "🔧 Starting the server..."
Write-Host "📍 Server will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🧪 Development mode - no database required" -ForegroundColor Yellow
Write-Host "⚠️  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue

# Start the server
node server.js
