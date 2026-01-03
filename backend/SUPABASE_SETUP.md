# 🗄️ Supabase Database Setup Guide

## Get Your Connection String

### Option 1: From Supabase Dashboard (Recommended)

1. **Go to your Supabase project:**
   - Visit https://supabase.com/dashboard
   - Select your project (or create a new one)

2. **Navigate to Database Settings:**
   - Click on the **Settings** icon (⚙️) in the left sidebar
   - Click on **Database**

3. **Find Connection String:**
   - Scroll down to **Connection string** section
   - Select the **URI** tab (not the other tabs)
   - You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

4. **Get Your Database Password:**
   - If you see `[YOUR-PASSWORD]`, you need to replace it
   - Your password is either:
     - The one you set when creating the project (check email)
     - Or reset it: Go to **Database Settings** → **Reset Database Password**

5. **Copy the Complete URL:**
   ```
   postgresql://postgres:your-actual-password@db.xxxxx.supabase.co:5432/postgres
   ```

### Option 2: From Project Settings

1. Go to: Project → Settings → Database
2. Under "Connection Info" you'll see:
   - Host: `db.xxxxx.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: [Your password]

3. Build the URL manually:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

---

## Important Supabase Configuration

### Connection Pooling (Recommended for Production)

Supabase provides two types of connections:

1. **Direct Connection** (default):
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

2. **Connection Pooling** (for production/better performance):
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
   ```

**For development, use the direct connection (port 5432).**
**For production, consider pooling (port 6543).**

---

## Add to Your .env File

1. Open your `.env` file in the backend directory:
   ```bash
   cd backend
   nano .env  # or open .env in your editor
   ```

2. Update the DATABASE_URL line:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```

   **Important:** Replace:
   - `YOUR_ACTUAL_PASSWORD` with your real Supabase password
   - `db.xxxxx.supabase.co` with your actual Supabase host

3. **Important for Prisma with Supabase:**
   
   Add this parameter to ensure SSL works correctly:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
   ```

   Or for even better compatibility:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
   ```

---

## Test Your Connection

1. **Test with Prisma:**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   ```

   If it works, you'll see:
   ```
   ✔ Generated Prisma Client
   Your database is now in sync with your schema.
   ```

2. **Test with Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```
   
   Should open http://localhost:5555 showing your empty tables.

3. **If you get connection errors, try:**
   ```bash
   # Test the connection directly
   psql "postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
   ```

---

## Common Supabase Issues & Fixes

### Issue: "Error: P1001: Can't reach database server"

**Solution 1:** Check SSL mode
```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
```

**Solution 2:** Verify password is correct (no special characters unencoded)
- If password has special characters like `@`, `#`, `$`, encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`

Example:
```
Password: my@pass#word
Encoded: my%40pass%23word
```

**Solution 3:** Check your IP isn't blocked
- Supabase free tier allows all IPs by default
- But check: Settings → Database → Connection Pooling

### Issue: "Error: P1017: Server has closed the connection"

**Solution:** Use connection pooling URL (port 6543):
```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
```

### Issue: "Prepared statement already exists"

**Solution:** Add `pgbouncer=true` and limit connections:
```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
```

---

## Verify Everything Works

After setting up your DATABASE_URL:

```bash
cd backend

# 1. Generate Prisma client
npm run prisma:generate

# 2. Run migrations
npm run prisma:migrate

# 3. Seed sample data
npm run prisma:seed

# 4. Start server
npm run dev
```

You should see:
```
✅ Created sample users
✅ Created sample cases
🎉 Database seed completed!
🚀 Server running on port 3000
```

---

## View Your Data in Supabase

You can also view your data in two places:

1. **Prisma Studio** (recommended):
   ```bash
   npm run prisma:studio
   ```
   Opens http://localhost:5555

2. **Supabase Dashboard**:
   - Go to your Supabase project
   - Click "Table Editor" in left sidebar
   - You should see tables: users, cases, photos, etc.

---

## Supabase Advantages

✅ **Free Tier Includes:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- Unlimited API requests

✅ **Built-in Features:**
- Automatic backups
- Point-in-time recovery
- Database webhooks
- Real-time subscriptions (if you want to use later)

✅ **Great for Development:**
- Fast setup
- No local PostgreSQL needed
- Easy to share with team
- Dashboard for viewing data

---

## Next Steps After Supabase Setup

1. ✅ Copy your connection string
2. ✅ Add to `.env` with `?sslmode=require`
3. ✅ Run `npm run prisma:generate`
4. ✅ Run `npm run prisma:migrate`
5. ✅ Run `npm run prisma:seed`
6. ✅ Run `npm run dev`
7. ✅ Test with `./test-backend.sh`

---

## Ready? Let's Configure!

Your DATABASE_URL should look like this:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
```

**Example with real values:**
```env
DATABASE_URL="postgresql://postgres:mySecurePass123@db.pkqxpxfmlkaazfguedpy.supabase.co:5432/postgres?sslmode=require"
```

Need help getting your connection string? Let me know!

