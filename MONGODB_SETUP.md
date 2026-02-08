# SnapStudy AI - MongoDB Setup Instructions

## Option 1: Install MongoDB Locally (Recommended for Development)

### For Windows:

1. **Download MongoDB Community Server**:
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows x64, MSI installer
   - Download and run the installer

2. **During Installation**:
   - Choose "Complete" setup
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:

   ```powershell
   # Check if service is running
   Get-Service -Name MongoDB

   # Start MongoDB if not running
   net start MongoDB
   ```

4. **Test Connection**:
   ```powershell
   # From your server directory
   cd "c:\Users\Administrator\Documents\SnapStudy AI\SnapStudy AI\server"
   node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected!')).catch(err => console.error('Connection failed:', err));"
   ```

## Option 2: Use MongoDB Atlas (Cloud - Free Tier Available)

If local installation doesn't work, we can set up MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get connection string
5. Update your .env file with the Atlas URI

## Current Status:

- Your .env file is configured for: `mongodb://localhost:27017/snapai`
- This expects MongoDB running locally on port 27017
- Database name will be: `snapai`

Let me know which option you prefer or if you encounter any issues!
