# Deployment Checklist

Use this checklist when deploying to production.

## Pre-Deployment

### ☐ Environment Variables
- [ ] `DATABASE_URL` set to production database
- [ ] `JWT_SECRET` is a strong random string (64+ characters)
- [ ] `JWT_ACCESS_EXPIRY` and `JWT_REFRESH_EXPIRY` configured
- [ ] `CLOUDINARY_*` credentials are correct and production-ready
- [ ] `PORT` set (or use default 3000)
- [ ] `NODE_ENV=production`
- [ ] `API_URL` set to production API URL
- [ ] `FRONTEND_URL` set to production frontend URL
- [ ] `RATE_LIMIT_*` configured appropriately
- [ ] `LOG_LEVEL` set to `warn` or `error`

### ☐ Database
- [ ] Production database created (PostgreSQL 14+)
- [ ] Database accessible from deployment platform
- [ ] Database connection tested
- [ ] Migrations run: `npm run prisma:migrate -- deploy`
- [ ] Prisma client generated: `npm run prisma:generate`
- [ ] (Optional) Seed data if needed: `npm run prisma:seed`
- [ ] Database backups configured
- [ ] Connection pooling configured if needed

### ☐ Security
- [ ] All secrets are environment variables (not hardcoded)
- [ ] CORS configured for production domain only
- [ ] HTTPS/SSL enabled
- [ ] Rate limiting configured
- [ ] File upload limits appropriate
- [ ] Input validation working
- [ ] Authentication tested

### ☐ Code & Build
- [ ] All TypeScript compiles without errors: `npm run build`
- [ ] All dependencies installed: `npm install --production`
- [ ] No console.log statements in production code
- [ ] Error handling complete
- [ ] Logs don't expose sensitive data
- [ ] .env file NOT in repository

### ☐ External Services
- [ ] Cloudinary account active
- [ ] Cloudinary has sufficient quota
- [ ] Upload presets configured if needed
- [ ] CDN working properly

### ☐ Testing
- [ ] All endpoints tested in staging
- [ ] Authentication flow tested
- [ ] File uploads tested
- [ ] WebSocket connections tested
- [ ] Rate limiting tested
- [ ] Error responses tested
- [ ] Load testing performed

## Deployment Steps

### Railway Deployment

1. **Create Project:**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Create new project
   railway init
   ```

2. **Add PostgreSQL:**
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Copy DATABASE_URL from Variables tab

3. **Set Environment Variables:**
   ```bash
   railway variables set JWT_SECRET=your-secret
   railway variables set NODE_ENV=production
   railway variables set FRONTEND_URL=https://your-frontend.com
   # ... set all other variables
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

### Render Deployment

1. **Create New Web Service:**
   - Connect GitHub repository
   - Select backend directory

2. **Configure:**
   - Build Command: `npm install && npm run prisma:generate && npm run build`
   - Start Command: `npm start`
   - Add environment variables in dashboard

3. **Add PostgreSQL:**
   - Create new PostgreSQL database
   - Copy Internal Database URL to DATABASE_URL

4. **Deploy:**
   - Render auto-deploys on push

### Fly.io Deployment

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Launch App:**
   ```bash
   cd backend
   fly launch
   ```

3. **Add PostgreSQL:**
   ```bash
   fly postgres create
   fly postgres attach <postgres-app-name>
   ```

4. **Set Secrets:**
   ```bash
   fly secrets set JWT_SECRET=your-secret
   fly secrets set NODE_ENV=production
   # ... set all secrets
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

## Post-Deployment

### ☐ Verification
- [ ] Health check endpoint working: `curl https://api.example.com/health`
- [ ] API documentation accessible
- [ ] Database migrations applied
- [ ] Sample request works: `curl https://api.example.com/api/cases`
- [ ] WebSocket connections working
- [ ] HTTPS certificate valid
- [ ] CORS working from frontend

### ☐ Monitoring
- [ ] Server logs accessible
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Uptime monitoring configured
- [ ] Performance monitoring setup
- [ ] Database monitoring enabled
- [ ] Alert notifications configured

### ☐ Documentation
- [ ] API documentation updated with production URL
- [ ] Frontend team has new API URL
- [ ] Deployment process documented
- [ ] Rollback procedure documented

### ☐ Security
- [ ] Security headers configured
- [ ] Rate limits tested and working
- [ ] No sensitive data in logs
- [ ] Database backups confirmed
- [ ] SSL certificate auto-renewal configured

### ☐ Performance
- [ ] Response times acceptable (< 200ms for most endpoints)
- [ ] Database queries optimized
- [ ] CDN working for images
- [ ] Connection pooling configured
- [ ] Load testing passed

## Common Deployment Issues

### Issue: Database connection fails
**Solutions:**
- Verify DATABASE_URL is correct
- Check if IP is whitelisted (if required)
- Ensure database is accessible from deployment platform
- Verify SSL mode if required: `?sslmode=require`

### Issue: Prisma client not found
**Solutions:**
- Add `npm run prisma:generate` to build command
- Ensure `@prisma/client` is in dependencies (not devDependencies)
- Clear build cache and redeploy

### Issue: File uploads fail
**Solutions:**
- Verify Cloudinary credentials
- Check network connectivity to Cloudinary
- Ensure file size limits are appropriate
- Verify account quotas not exceeded

### Issue: WebSocket connections fail
**Solutions:**
- Ensure WebSocket support enabled on platform
- Check CORS configuration
- Verify frontend WebSocket URL is correct
- Check firewall rules

### Issue: Rate limiting too aggressive
**Solutions:**
- Adjust RATE_LIMIT_MAX_REQUESTS
- Consider using Redis for distributed rate limiting
- Whitelist certain IPs if needed

## Rollback Procedure

If deployment fails or issues arise:

1. **Rollback Code:**
   ```bash
   # Railway
   railway rollback
   
   # Render
   # Use dashboard to redeploy previous version
   
   # Fly.io
   fly releases
   fly releases rollback <version>
   ```

2. **Rollback Database:**
   ```bash
   # Only if you made schema changes
   # Restore from backup or run down migration
   ```

3. **Notify Team:**
   - Alert frontend team
   - Document issue
   - Create post-mortem if needed

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Check database performance monthly
- [ ] Review and update dependencies monthly
- [ ] Verify backups are working
- [ ] Check SSL certificate expiration
- [ ] Review rate limit effectiveness
- [ ] Analyze performance metrics

### Scaling Checklist
When you need to scale:
- [ ] Add database read replicas
- [ ] Implement caching (Redis)
- [ ] Use CDN for static assets
- [ ] Horizontal scaling (multiple instances)
- [ ] Database connection pooling
- [ ] Optimize slow queries
- [ ] Consider database sharding

## Support Contacts

**Database:** [Your DB provider support]
**Hosting:** [Your hosting provider support]
**CDN:** support@cloudinary.com
**Team Lead:** [Contact info]

## Additional Resources

- [Backend README.md](./README.md)
- [Setup Guide](./SETUP.md)
- [API Testing Guide](./API_TESTING.md)
- [Implementation Details](./IMPLEMENTATION.md)

---

**Last Updated:** January 3, 2026
**Maintained By:** Development Team

