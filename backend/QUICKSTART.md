# 🚀 Quick Setup Checklist

Follow this checklist to get your backend running in 5-10 minutes!

## ✅ Step-by-Step Setup

### □ 1. Choose Your Database

Pick ONE option:

**Option A: Railway (Easiest - 2 minutes)**
- Go to https://railway.app → Sign up
- New Project → Provision PostgreSQL
- Copy the "Postgres Connection URL"

**Option B: Local PostgreSQL**
- Install: `brew install postgresql@14` (macOS)
- Start: `brew services start postgresql@14`
- Create DB: `createdb animal_rescue_db`
- URL: `postgresql://postgres@localhost:5432/animal_rescue_db`

**Option C: Supabase (Free)**
- Go to https://supabase.com → Create project
- Settings → Database → Copy connection string

---

### □ 2. Get Cloudinary Credentials (2 minutes)

1. Go to https://cloudinary.com → Sign up (free)
2. Dashboard → Copy:
   - Cloud name
   - API Key  
   - API Secret

---

### □ 3. Install Dependencies

```bash
cd backend
npm install
```

Expected: Dependencies installed successfully

---

### □ 4. Configure Environment

```bash
# Copy template
cp .env.example .env

# Open in editor
open .env  # macOS
# or
nano .env  # Linux
```

**Fill in these values:**
```env
DATABASE_URL=postgresql://...        # From step 1
JWT_SECRET=...                        # Generate with command below
CLOUDINARY_CLOUD_NAME=...            # From step 2
CLOUDINARY_API_KEY=...               # From step 2
CLOUDINARY_API_SECRET=...            # From step 2
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy output and paste as JWT_SECRET

---

### □ 5. Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed sample data (optional but recommended)
npm run prisma:seed
```

Expected output from seed:
```
✅ Created sample users
✅ Created sample cases
🎉 Database seed completed!
```

**Sample credentials created:**
- Email: maria@example.com / Password: Password123
- Email: chen@example.com / Password: Password123
- Email: sarah@example.com / Password: Password123

---

### □ 6. Start Server

```bash
npm run dev
```

Expected output:
```
🚀 Server running on port 3000
📡 WebSocket server ready
🌍 Environment: development
```

✅ **Keep this terminal open!**

---

### □ 7. Test It Works

**Open a NEW terminal** and run:

```bash
# Quick health check
curl http://localhost:3000/health

# Should return: {"status":"ok","timestamp":"..."}
```

```bash
# Get sample cases
curl http://localhost:3000/api/cases

# Should return: {"cases":[...],"pagination":{...}}
```

✅ **If you see data, it works!**

---

## 🧪 Run Automated Tests

```bash
cd backend
./test-backend.sh
```

This runs 13 automated tests covering all major features.

---

## 🎯 Verify Everything

### Quick Verification Checklist:

- □ Server starts without errors
- □ Health check returns OK
- □ Public cases endpoint returns data
- □ Can register a new user
- □ Can login and get token
- □ Can create a case (with authentication)
- □ Can see case in Prisma Studio (`npm run prisma:studio`)

---

## 🐛 Common Issues & Fixes

### "Cannot connect to database"
```bash
# Check your DATABASE_URL in .env
# Test connection:
psql $DATABASE_URL
```

### "Module not found"
```bash
# Reinstall dependencies:
rm -rf node_modules
npm install
```

### "Port 3000 already in use"
```bash
# Option 1: Change PORT in .env to 3001
# Option 2: Kill process using port:
lsof -ti:3000 | xargs kill -9
```

### "Prisma client not generated"
```bash
npm run prisma:generate
```

---

## 📚 Next Steps After Setup

1. **Explore the API:**
   - See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed test commands
   - See [API_TESTING.md](API_TESTING.md) for curl examples

2. **View Your Data:**
   ```bash
   npm run prisma:studio
   ```
   Opens http://localhost:5555 with database GUI

3. **Check Logs:**
   ```bash
   tail -f combined.log
   ```

4. **Connect Frontend:**
   - Set frontend API_URL to `http://localhost:3000`
   - Test authentication flow
   - Test WebSocket connection

5. **Deploy (when ready):**
   - See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📖 Documentation Reference

- **[README.md](README.md)** - Complete API docs
- **[SETUP.md](SETUP.md)** - Detailed setup guide
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Step-by-step testing
- **[API_TESTING.md](API_TESTING.md)** - All API endpoints
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment

---

## ✅ You're Done!

Your backend is now running at: **http://localhost:3000**

API endpoints:
- Health: http://localhost:3000/health
- Cases: http://localhost:3000/api/cases
- Stats: http://localhost:3000/api/stats
- Auth: http://localhost:3000/api/auth/login

WebSocket: ws://localhost:3000

---

**Need help?** Check the detailed guides above or review server logs.

**Ready to code!** 🚀🐾

