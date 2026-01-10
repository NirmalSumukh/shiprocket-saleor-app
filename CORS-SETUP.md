# CORS Configuration Guide

## Overview
This ShipRocket integration app uses CORS (Cross-Origin Resource Sharing) to control which domains can access the checkout API endpoints.

## Important Environment Variable

The `ALLOWED_ORIGINS` environment variable controls which URLs are permitted to call your ShipRocket checkout APIs.

## Configuration Instructions

### 1. **Production Deployment** (Current VPS Setup)
When the app is deployed to `https://shiprocket.leemasmart.com`, set:

```env
ALLOWED_ORIGINS=https://leemasmart.com,https://saleor.leemasmart.com,https://shiprocket.leemasmart.com
```

### 2. **Testing with Local Frontend** (Development + Production Mix)
When you want to test the **production ShipRocket app** with your **local frontend** running at `http://localhost:3000`:

```env
ALLOWED_ORIGINS=https://leemasmart.com,https://saleor.leemasmart.com,https://shiprocket.leemasmart.com,http://localhost:3000
```

**⚠️ Important**: After updating the `.env` file on your VPS, you MUST rebuild/restart the app:

```bash
# If using Docker
docker-compose down
docker-compose up -d --build

# If using PM2/Node directly
pm2 restart shiprocket-app
```

### 3. **Full Local Development**
When both the frontend AND ShipRocket app are running locally:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:9000,http://localhost:3010
```

## Common Errors

### ❌ "Origin not allowed" (403 Forbidden)
**Cause**: The requesting origin (e.g., `http://localhost:3000`) is not in the `ALLOWED_ORIGINS` list.

**Fix**: Add the missing origin to your `.env` and restart the app.

### ❌ CORS Preflight Failed
**Cause**: Browser sends an OPTIONS request that's being blocked.

**Fix**: Ensure CORS middleware is properly configured (already done in this app).

## Current Setup Summary

- **CORS Middleware**: `src/lib/shiprocket/cors.ts`
- **Applied to**: `/api/shiprocket/checkout/authorize` endpoint
- **Environment Variable**: `ALLOWED_ORIGINS` (comma-separated list)
- **Validation**: On app startup (throws error if not configured)

## Security Best Practices

1. ✅ **Never use `*` wildcard** in production
2. ✅ **Remove localhost URLs** from production deployment after testing
3. ✅ **Use HTTPS** for production origins
4. ✅ **Include only necessary domains** (storefront, dashboard, app URL)

## Quick Reference

| Environment | Frontend | ShipRocket App | ALLOWED_ORIGINS |
|------------|----------|----------------|-----------------|
| **Local Dev** | localhost:3000 | localhost:3010 | `http://localhost:3000,http://localhost:9000,http://localhost:3010` |
| **Testing** | localhost:3000 | shiprocket.leemasmart.com | `https://leemasmart.com,https://saleor.leemasmart.com,https://shiprocket.leemasmart.com,http://localhost:3000` |
| **Production** | leemasmart.com | shiprocket.leemasmart.com | `https://leemasmart.com,https://saleor.leemasmart.com,https://shiprocket.leemasmart.com` |
