# 🚀 SnapStudy AI - Deployment Guide

## 📋 Production Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Prepare Environment Variables**:

   ```bash
   # Create .env.production with your values
   cp server/.env.example server/.env.production
   ```

2. **Deploy to Vercel**:

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and deploy
   vercel login
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard**:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Strong random string (32+ characters)
   - `GEMINI_API_KEY` - Your Google AI API key

### Option 2: Docker (Full Stack)

1. **Build and Run with Docker Compose**:

   ```bash
   # Build and start all services
   docker-compose up -d

   # View logs
   docker-compose logs -f

   # Stop services
   docker-compose down
   ```

2. **Access the Application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - MongoDB: localhost:27017

### Option 3: Netlify (Frontend Only)

1. **Deploy Frontend**:

   ```bash
   # Build the frontend
   npm run build

   # Install Netlify CLI
   npm i -g netlify-cli

   # Deploy
   netlify login
   netlify deploy --prod --dir=dist
   ```

2. **Deploy Backend Separately** (Railway, Heroku, etc.)

### Option 4: Manual Server Deployment

1. **Prepare Server**:

   ```bash
   # Install Node.js 18+, MongoDB, PM2
   sudo apt update
   sudo apt install nodejs npm mongodb
   npm i -g pm2
   ```

2. **Deploy Application**:

   ```bash
   # Clone and setup
   git clone <your-repo>
   cd SnapStudy-AI

   # Install dependencies
   npm ci
   cd server && npm ci

   # Build frontend
   cd .. && npm run build

   # Start with PM2
   cd server
   pm2 start server.js --name "snapai"
   ```

## 🔧 Environment Configuration

### Frontend Environment Variables:

- No environment variables needed (API URL is configured in code)

### Backend Environment Variables:

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/snapai
JWT_SECRET=your-super-secure-32-character-minimum-secret
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
CLIENT_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=10485760
```

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Update MONGO_URI in environment variables

### Option 2: Local MongoDB

1. Install MongoDB Community Server
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/snapai`

## 🔐 Security Checklist

- [ ] Strong JWT_SECRET (32+ random characters)
- [ ] Database user with minimal permissions
- [ ] CORS configured for your domain
- [ ] Environment variables secured
- [ ] API rate limiting enabled
- [ ] File upload size limits set
- [ ] MongoDB Atlas IP whitelist configured

## 📊 Monitoring & Logs

### Vercel:

- View logs in Vercel dashboard
- Monitor function usage and performance

### Docker:

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f mongodb
```

### PM2:

```bash
# View logs
pm2 logs snapai

# Monitor
pm2 monit

# Restart
pm2 restart snapai
```

## 🚨 Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**:
   - Check MONGO_URI format
   - Verify database user permissions
   - Check network connectivity

2. **JWT Token Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration (30 days default)

3. **File Upload Failed**:
   - Check MAX_FILE_SIZE setting
   - Verify multer configuration

4. **CORS Errors**:
   - Update CLIENT_URL in backend
   - Check Vercel/Netlify domain settings

5. **AI Generation Failed**:
   - Verify GEMINI_API_KEY is valid
   - Check API quotas and billing
   - Review fallback content in logs

## 🔄 CI/CD Pipeline

The GitHub Actions workflow will:

1. Run tests on every push
2. Deploy to Vercel on main branch
3. Build and push Docker images
4. Run security and lint checks

Set these secrets in GitHub repository settings:

- `VERCEL_TOKEN`
- `ORG_ID` (Vercel)
- `PROJECT_ID` (Vercel)
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## 📈 Scaling

### Performance Optimization:

- Frontend: Served via CDN (Vercel/Netlify)
- Database: Connection pooling enabled
- File uploads: Consider cloud storage (AWS S3, Cloudinary)
- API: Implement Redis caching for frequent queries

### Monitoring:

- Application Performance Monitoring (APM)
- Database query optimization
- Error tracking (Sentry)
- Uptime monitoring

---

## 🆘 Support

If you encounter issues:

1. Check the logs first
2. Verify environment variables
3. Test database connectivity
4. Review this deployment guide
5. Check GitHub issues

Happy deploying! 🚀
