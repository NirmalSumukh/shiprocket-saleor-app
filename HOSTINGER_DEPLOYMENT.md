# Hostinger Deployment Guide

Quick guide to deploy the Saleor ShipRocket app on Hostinger VPS.

## Prerequisites

- Hostinger VPS with Docker and Docker Compose installed
- Domain `shiprocket.leemasmart.com` pointing to your VPS IP
- PostgreSQL database (can use same as Saleor)

## Step-by-Step Deployment

### 1. SSH into your VPS

```bash
ssh root@your-vps-ip
```

### 2. Clone the repository

```bash
git clone <your-repo-url>
cd saleor-app-template
```

### 3. Create environment file

```bash
cp .env.production.example .env
nano .env  # Edit with your actual values
```

**Required values to update:**
- `SECRET_KEY` - Generate with `openssl rand -base64 32`
- `SALEOR_API_URL` - Your Saleor GraphQL endpoint
- `DATABASE_URL` - PostgreSQL connection string
- `SHIPROCKET_API_KEY` / `SHIPROCKET_SECRET_KEY` - From ShipRocket
- `STOREFRONT_URL` - Your main website URL
- `ALLOWED_ORIGINS` - Include all domains that will call this app

### 4. Setup SSL Certificate

```bash
# Update email in script first
nano scripts/setup-ssl.sh  # Change EMAIL variable

# Make executable and run
chmod +x scripts/setup-ssl.sh
sudo ./scripts/setup-ssl.sh
```

### 5. Verify Deployment

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Test health endpoint
curl https://shiprocket.leemasmart.com/api/health
```

## Install App in Saleor

1. Open Saleor Dashboard → Apps → Install External App
2. Enter: `https://shiprocket.leemasmart.com/api/manifest`
3. Grant required permissions
4. Copy the app token to your `.env` file (`SALEOR_APP_TOKEN`)
5. Restart: `docker-compose restart app`

## Common Commands

```bash
# Restart services
docker-compose restart

# Rebuild after code changes
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Full rebuild (clear cache)
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

**SSL Certificate Issues:**
- Ensure domain points to VPS IP
- Port 80 must be open for Let's Encrypt
- Run `docker-compose logs certbot` for errors

**App Not Starting:**
- Check `docker-compose logs app`
- Verify all env variables are set
- Ensure PostgreSQL is accessible

**Cannot Connect to Saleor:**
- Verify `SALEOR_API_URL` is correct
- Check if Saleor instance allows your app's origin
