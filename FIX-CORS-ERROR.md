# Fix Instructions for "Origin not allowed" Error

## Problem
The ShipRocket app at `https://shiprocket.leemasmart.com` is blocking requests from your local frontend at `http://localhost:3000` with the error:
```
403 Forbidden - Origin not allowed
```

## Root Cause
The `ALLOWED_ORIGINS` environment variable in your production `.env` file doesn't include `http://localhost:3000`.

## Solution

### Step 1: SSH into Your Hostinger VPS
```bash
ssh your-user@your-vps-ip
```

### Step 2: Navigate to ShipRocket App Directory
```bash
cd /path/to/your/shiprocket-app  # Update this path
```

### Step 3: Edit the .env File
```bash
nano .env
# OR
vi .env
```

### Step 4: Update ALLOWED_ORIGINS
Find the line that says:
```env
ALLOWED_ORIGINS=https://leemasmart.com,https://saleor.leemasmart.com,https://shiprocket.leemasmart.com
```

Change it to:
```env
ALLOWED_ORIGINS=https://leemasmart.com,https://saleor.leemasmart.com,https://shiprocket.leemasmart.com,http://localhost:3000
```

**Save and exit** (Ctrl+X, then Y, then Enter for nano)

### Step 5: Rebuild/Restart the App

#### If using Docker:
```bash
cd /path/to/shiprocket-app
docker-compose down
docker-compose up -d --build
```

#### If using Docker without docker-compose:
```bash
docker ps  # Find the container ID
docker restart <container-id>
```

#### If using PM2:
```bash
pm2 restart shiprocket-app
```

#### If using Node directly:
```bash
# Find the process
ps aux | grep node

# Kill and restart
pkill -f shiprocket
npm start  # or your start command
```

### Step 6: Verify Changes
Check the logs to confirm the app restarted with the new config:

```bash
# Docker
docker logs shiprocket-app-container-name

# PM2
pm2 logs shiprocket-app

# Should see: "CORS configuration validated" with localhost:3000 in the list
```

### Step 7: Test from Frontend
1. Go back to your local frontend at `http://localhost:3000`
2. Add a product to cart
3. Click "Proceed to Checkout"
4. The "Origin not allowed" error should be gone! ✅

## Important Notes

⚠️ **Remember to remove `http://localhost:3000` from production once testing is complete!**

After you deploy your production frontend, update `.env` again:
```env
ALLOWED_ORIGINS=https://leemasmart.com,https://saleor.leemasmart.com,https://shiprocket.leemasmart.com
```

## Additional Documentation

- See `CORS-SETUP.md` for comprehensive CORS configuration guide
- See `.env.production.example` for annotated environment variable examples

## Git Commits
The following files have been updated and pushed to Git:
- ✅ `.env.production.example` - Added localhost documentation
- ✅ `CORS-SETUP.md` - Comprehensive CORS guide

Pull these changes on your VPS if needed:
```bash
git pull origin main
```
