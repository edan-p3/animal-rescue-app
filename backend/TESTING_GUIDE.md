# 🧪 Complete Backend Testing Guide

Follow this guide step-by-step to test your backend from scratch!

## Prerequisites Checklist

Before starting, make sure you have:
- ✅ Node.js installed (v18+) - You have v24 ✓
- ⬜ PostgreSQL installed OR access to a hosted database
- ⬜ Cloudinary account (free tier is fine)

---

## Part 1: Database Setup

### Option A: Local PostgreSQL (Recommended for Development)

If you don't have PostgreSQL installed locally, use a hosted option below.

**Install PostgreSQL:**
- **macOS**: `brew install postgresql@14 && brew services start postgresql@14`
- **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
- **Windows**: Download from https://www.postgresql.org/download/windows/

**Create Database:**
```bash
# macOS/Linux
createdb animal_rescue_db

# Or using psql
psql -U postgres
CREATE DATABASE animal_rescue_db;
\q
```

**Your DATABASE_URL will be:**
```
postgresql://postgres:password@localhost:5432/animal_rescue_db
```
(Replace `password` with your PostgreSQL password, or leave empty if no password)

### Option B: Railway (Easiest - Hosted, Free Tier)

1. Go to https://railway.app
2. Sign up with GitHub (free)
3. Click "New Project" → "Provision PostgreSQL"
4. Click on PostgreSQL → "Connect" → Copy the "Postgres Connection URL"
5. Your DATABASE_URL looks like: `postgresql://postgres:...@containers-us-west-xxx.railway.app:7432/railway`

### Option C: Supabase (Hosted, Free Tier)

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection String → URI
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

### Option D: Neon (Serverless Postgres, Free Tier)

1. Go to https://neon.tech
2. Sign up and create a project
3. Copy the connection string from the dashboard

---

## Part 2: Cloudinary Setup

1. Go to https://cloudinary.com
2. Sign up for a free account
3. Go to Dashboard: https://cloudinary.com/console
4. Copy these three values:
   - **Cloud name**: (e.g., "dxxxxx")
   - **API Key**: (e.g., "123456789012345")
   - **API Secret**: (e.g., "abcdef123456...")

---

## Part 3: Environment Configuration

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
# Copy the example
cp .env.example .env

# Open in your editor
# macOS: open .env
# Linux: nano .env
# Windows: notepad .env
```

4. **Edit .env with your values:**
```env
# REQUIRED: Your PostgreSQL connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/animal_rescue_db

# REQUIRED: Generate a secure random string
# Run this: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-generated-secret-here

# REQUIRED: Your Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# These can stay as-is for local development
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as your JWT_SECRET

---

## Part 4: Database Initialization

1. **Generate Prisma Client:**
```bash
npm run prisma:generate
```
Expected output: ✔ Generated Prisma Client

2. **Run Database Migrations:**
```bash
npm run prisma:migrate
```
- If prompted for migration name, enter: `init`
- Expected output: Migration applied successfully

3. **Verify Database Connection:**
```bash
npm run prisma:studio
```
- This opens http://localhost:5555
- You should see empty tables: users, cases, etc.
- Press Ctrl+C to close it

4. **Seed Sample Data (Optional but Recommended):**
```bash
npm run prisma:seed
```
Expected output:
```
🌱 Starting database seed...
✅ Created sample users
✅ Created sample cases
✅ Added collaborators
✅ Added activity logs
🎉 Database seed completed!

📝 Sample credentials:
  Email: maria@example.com
  Email: chen@example.com
  Email: sarah@example.com
  Password (all): Password123
```

---

## Part 5: Start the Server

```bash
npm run dev
```

Expected output:
```
🚀 Server running on port 3000
📡 WebSocket server ready
🌍 Environment: development
```

**Keep this terminal open!** The server is now running.

---

## Part 6: Test the API (Open a New Terminal)

Now let's test each feature systematically. **Open a new terminal window** and run these commands:

### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2026-01-03T..."}
```

✅ If you see this, your server is running correctly!

---

### Test 2: Get Public Cases (Without Authentication)

```bash
curl http://localhost:3000/api/cases
```

**Expected Response:**
```json
{
  "cases": [
    {
      "id": "...",
      "species": "dog",
      "description": "Brown labrador mix...",
      "status": "at_vet",
      "urgency": "high",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "total_pages": 1
  }
}
```

✅ If you see cases (from seed data), public API works!

---

### Test 3: Get Dashboard Statistics

```bash
curl http://localhost:3000/api/stats
```

**Expected Response:**
```json
{
  "active_cases": 2,
  "rescued_this_month": 3,
  "in_foster_care": 1,
  "adopted_this_month": 0,
  "by_urgency": {...},
  "by_status": {...},
  "by_species": {...}
}
```

✅ Statistics API works!

---

### Test 4: User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User",
    "role": "rescuer",
    "phone": "+1234567890"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "rescuer"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "..."
}
```

✅ **SAVE THE ACCESS TOKEN!** You'll need it for the next tests.

**Set it as a variable:**
```bash
export TOKEN="paste-your-access-token-here"
```

---

### Test 5: User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "Password123"
  }'
```

**Expected Response:** Same format as registration with tokens

✅ Authentication works!

---

### Test 6: Get Current User Profile

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "id": "...",
  "email": "test@example.com",
  "name": "Test User",
  "role": "rescuer",
  "phone": "+1234567890",
  "created_at": "..."
}
```

✅ JWT authentication works!

---

### Test 7: Create a New Case

```bash
curl -X POST http://localhost:3000/api/cases \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "cat",
    "description": "Fluffy orange cat, very friendly",
    "status": "rescued",
    "urgency": "medium",
    "locationFound": "123 Oak Street, Downtown",
    "locationCurrent": "My home temporarily",
    "conditionDescription": "Healthy but hungry",
    "behaviorNotes": "Very affectionate",
    "isPublic": true
  }'
```

**Expected Response:**
```json
{
  "id": "new-case-id-here",
  "species": "cat",
  "description": "Fluffy orange cat...",
  "status": "rescued",
  "urgency": "medium",
  ...
}
```

✅ **SAVE THE CASE ID!** Use it for the next tests.

```bash
export CASE_ID="paste-case-id-here"
```

---

### Test 8: Update the Case

```bash
curl -X PUT http://localhost:3000/api/cases/$CASE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "at_foster",
    "locationCurrent": "Foster home on Elm St",
    "publicNotes": "Cat is settling in well at foster home"
  }'
```

**Expected Response:** Updated case object

✅ Case updates work!

---

### Test 9: Add a Note to the Case

```bash
curl -X POST http://localhost:3000/api/cases/$CASE_ID/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Cat ate well today and is playing with toys",
    "is_public": true
  }'
```

**Expected Response:**
```json
{
  "activity": {
    "id": "...",
    "case_id": "...",
    "action_type": "note_added",
    "description": "Cat ate well today...",
    ...
  }
}
```

✅ Activity logging works!

---

### Test 10: Get Your Cases

```bash
curl http://localhost:3000/api/users/me/cases \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** List of your cases with pagination

✅ User-specific queries work!

---

### Test 11: Upload a Photo (Requires Image File)

First, create a simple test image or use an existing one:

```bash
# Create a test image (if you have ImageMagick)
convert -size 300x300 xc:blue test-photo.jpg

# Or find any .jpg file on your computer
# Then upload:
curl -X POST http://localhost:3000/api/cases/$CASE_ID/photos \
  -H "Authorization: Bearer $TOKEN" \
  -F "photos=@test-photo.jpg" \
  -F "is_primary=true"
```

**Expected Response:**
```json
{
  "photos": [
    {
      "id": "...",
      "url": "https://res.cloudinary.com/...",
      "thumbnail_url": "https://res.cloudinary.com/.../w_300,h_300...",
      "is_primary": true,
      ...
    }
  ]
}
```

✅ Photo uploads to Cloudinary work!

---

### Test 12: Get Case with Full Details

```bash
curl http://localhost:3000/api/cases/$CASE_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** Full case object with photos, collaborators, and activity log

✅ Complete case retrieval works!

---

### Test 13: Filter Cases

```bash
# Filter by species
curl "http://localhost:3000/api/cases?species=cat"

# Filter by urgency
curl "http://localhost:3000/api/cases?urgency=high"

# Filter by status
curl "http://localhost:3000/api/cases?status=at_foster"

# Search
curl "http://localhost:3000/api/cases?search=friendly"

# Combine filters
curl "http://localhost:3000/api/cases?species=cat&urgency=medium&page=1&limit=5"
```

✅ Filtering and pagination work!

---

## Part 7: Test WebSocket (Real-Time Updates)

### Option A: Using Browser Console

1. Open Chrome/Firefox and go to http://localhost:3000
2. Open Developer Console (F12)
3. Paste this code:

```javascript
// Load Socket.io client
const script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
document.head.appendChild(script);

// Wait a moment, then connect
setTimeout(() => {
  const socket = io('http://localhost:3000');
  
  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket!');
  });
  
  socket.on('case_created', (data) => {
    console.log('🆕 Case created:', data);
  });
  
  socket.on('case_updated', (data) => {
    console.log('📝 Case updated:', data);
  });
  
  socket.on('case_deleted', (data) => {
    console.log('🗑️ Case deleted:', data);
  });
  
  console.log('WebSocket listener set up!');
}, 1000);
```

4. Now create/update a case using curl (from tests above)
5. You should see events logged in the console!

### Option B: Using Node.js Script

Create a file `test-websocket.js`:

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket!');
});

socket.on('case_created', (data) => {
  console.log('🆕 Case created:', data);
});

socket.on('case_updated', (data) => {
  console.log('📝 Case updated:', data);
});

socket.on('case_deleted', (data) => {
  console.log('🗑️ Case deleted:', data);
});

console.log('Listening for events...');
```

Run it:
```bash
npm install socket.io-client
node test-websocket.js
```

✅ Real-time updates work!

---

## Part 8: Test Error Handling

### Test Invalid Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "short",
    "name": "X",
    "role": "invalid"
  }'
```

**Expected:** 400 error with validation details

✅ Validation works!

### Test Unauthorized Access
```bash
curl -X POST http://localhost:3000/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "species": "dog",
    "status": "rescued",
    "urgency": "high",
    "locationFound": "Test"
  }'
```

**Expected:** 401 Unauthorized error

✅ Authentication required works!

### Test Rate Limiting
```bash
# Try to register 10 times rapidly
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@example.com\",\"password\":\"Pass123\",\"name\":\"Test\",\"role\":\"rescuer\"}"
  echo ""
done
```

**Expected:** After 5 requests, you should get 429 Too Many Requests

✅ Rate limiting works!

---

## Part 9: Verify in Prisma Studio

```bash
npm run prisma:studio
```

Open http://localhost:5555 and verify:

1. **Users table**: Should see your test user + seed users
2. **Cases table**: Should see your created case
3. **Activity_log table**: Should see all activities
4. **Photos table**: Should see uploaded photos (if you tested uploads)

✅ Database integrity confirmed!

---

## Part 10: Check Logs

View the server logs:

```bash
# In the backend directory
tail -20 combined.log
```

You should see structured JSON logs of all actions.

✅ Logging works!

---

## 🎯 Test Summary Checklist

After completing all tests, verify:

- ✅ Health check responds
- ✅ Public case listing works
- ✅ Statistics endpoint works
- ✅ User registration works
- ✅ User login works
- ✅ JWT authentication works
- ✅ Case creation works
- ✅ Case updates work
- ✅ Activity notes work
- ✅ User's cases query works
- ✅ Photo uploads work (if tested)
- ✅ Filtering/pagination works
- ✅ WebSocket events work
- ✅ Validation catches bad data
- ✅ Authentication required for protected routes
- ✅ Rate limiting prevents abuse
- ✅ Database shows correct data
- ✅ Logs capture activities

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL in .env
- Verify PostgreSQL is running: `pg_isready` or check Railway/Supabase dashboard
- Try connecting manually: `psql $DATABASE_URL`

### "Cloudinary upload failed"
- Verify credentials in .env
- Check Cloudinary dashboard: https://cloudinary.com/console
- Ensure API key has upload permissions

### "Module not found" errors
- Run `npm install` in backend directory
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Port 3000 already in use
- Change PORT in .env to 3001
- Or kill process: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

### Token expired
- Get a new token by logging in again
- Access tokens expire after 15 minutes

---

## 🎉 Success!

If all tests pass, your backend is fully functional! 

**Next Steps:**
1. Connect your frontend to http://localhost:3000
2. Test the full application flow
3. Deploy to production when ready (see DEPLOYMENT.md)

---

**Need Help?**
- Check server logs: `tail -f combined.log`
- Review error responses carefully
- See SETUP.md for more troubleshooting

