# Setup Guide - Animal Rescue Backend

This guide will walk you through setting up the backend from scratch.

## Prerequisites

Before you begin, make sure you have:
- Node.js 18 or higher installed
- PostgreSQL 14 or higher installed and running
- A Cloudinary account (free tier works fine)

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

1. Create a new database:
```bash
createdb animal_rescue_db
```

2. Your DATABASE_URL will be:
```
postgresql://username:password@localhost:5432/animal_rescue_db
```

Replace `username` and `password` with your PostgreSQL credentials.

### Option B: Railway (Hosted)

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the DATABASE_URL from the connection info

### Option C: Other Hosted Options

- **Supabase**: Create a project and get the connection string
- **Neon**: Create a serverless Postgres database
- **ElephantSQL**: Free PostgreSQL hosting

## Step 3: Configure Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your values:

```env
# Database - REQUIRED
DATABASE_URL=postgresql://user:pass@localhost:5432/animal_rescue_db

# JWT Secret - REQUIRED (generate a random string)
JWT_SECRET=your-very-secure-random-secret-key-here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary - REQUIRED for photo uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# API Configuration
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# Rate Limiting (optional, defaults shown)
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Getting Cloudinary Credentials

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. Go to your Dashboard
3. Copy your Cloud name, API Key, and API Secret
4. Paste them into your `.env` file

### Generating a JWT Secret

Run this command to generate a secure random secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 4: Set Up Database Schema

1. Generate Prisma Client:
```bash
npm run prisma:generate
```

2. Run database migrations:
```bash
npm run prisma:migrate
```

You'll be prompted to name your migration. You can name it "init" or "initial_schema".

3. (Optional) Seed the database with sample data:
```bash
npm run prisma:seed
```

This will create:
- 3 sample users (maria, chen, sarah) - password: `Password123`
- 3 sample rescue cases
- Collaborator relationships
- Activity logs

## Step 5: Verify Database Setup

Open Prisma Studio to verify your database:
```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit your data.

## Step 6: Start the Server

Start the development server with hot reload:
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📡 WebSocket server ready
🌍 Environment: development
```

## Step 7: Test the API

### Test the health endpoint:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-01-03T..."}
```

### Test user registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User",
    "role": "rescuer"
  }'
```

Expected response includes `user` object and `access_token`.

### Test getting cases:
```bash
curl http://localhost:3000/api/cases
```

Expected response includes `cases` array and `pagination` object.

## Step 8: Test WebSocket Connection

You can test WebSocket using a simple HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>WebSocket Test</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>WebSocket Test</h1>
  <div id="status">Connecting...</div>
  <div id="events"></div>

  <script>
    const socket = io('http://localhost:3000');
    
    socket.on('connect', () => {
      document.getElementById('status').textContent = 'Connected!';
      console.log('Connected to WebSocket');
    });
    
    socket.on('case_created', (data) => {
      console.log('Case created:', data);
      const div = document.createElement('div');
      div.textContent = 'Case created: ' + JSON.stringify(data);
      document.getElementById('events').appendChild(div);
    });
    
    socket.on('case_updated', (data) => {
      console.log('Case updated:', data);
      const div = document.createElement('div');
      div.textContent = 'Case updated: ' + JSON.stringify(data);
      document.getElementById('events').appendChild(div);
    });
  </script>
</body>
</html>
```

## Common Issues

### Issue: "Cannot connect to database"

**Solution**: 
- Verify PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL is correct
- Make sure the database exists

### Issue: "Prisma generate fails"

**Solution**:
```bash
npm install @prisma/client prisma --save
npm run prisma:generate
```

### Issue: "Module not found" errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Photo upload fails

**Solution**:
- Verify Cloudinary credentials are correct
- Check that the API key has upload permissions
- Try uploading directly to Cloudinary dashboard to verify account works

### Issue: Port 3000 already in use

**Solution**:
- Change PORT in `.env` to 3001 or another free port
- Or kill the process using port 3000:
  ```bash
  # On macOS/Linux
  lsof -ti:3000 | xargs kill -9
  
  # On Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

## Production Deployment

For production deployment, see the main README.md file for platform-specific instructions.

Key production changes needed:
1. Set `NODE_ENV=production`
2. Use a hosted PostgreSQL database
3. Set a strong JWT_SECRET
4. Configure FRONTEND_URL to your actual domain
5. Enable HTTPS
6. Set up proper logging/monitoring

## Next Steps

- Review the API documentation in README.md
- Test all endpoints with Postman or curl
- Connect your frontend to the API
- Set up automated backups for production

## Getting Help

If you encounter issues:
1. Check the logs in `combined.log` and `error.log`
2. Verify all environment variables are set correctly
3. Make sure PostgreSQL is running and accessible
4. Check that you're using Node.js 18 or higher

## Development Workflow

1. Make changes to code
2. Server auto-reloads (with `npm run dev`)
3. If you change the database schema:
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```
4. Test your changes
5. Commit when ready

Happy coding! 🚀

