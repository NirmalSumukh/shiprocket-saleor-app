# Hostinger VPS Deployment Guide

Deploy the Saleor ShipRocket app at `shiprocket.leemasmart.com`.

## Prerequisites

- Saleor backend running at `saleor.leemasmart.com` (provides Traefik + leemasmart-network)
- DNS: `shiprocket.leemasmart.com` → VPS IP address
- SSH access to your VPS

## Deployment Steps

### 1. SSH into VPS

```bash
ssh root@your-vps-ip
```

### 2. Clone the repository

```bash
cd /opt
git clone https://github.com/NirmalSumukh/shiprocket-saleor-app.git
cd shiprocket-saleor-app
```

### 3. Create environment file

```bash
cp .env.production.example .env
nano .env
```

**Update these values:**
```env
SECRET_KEY=<generate with: openssl rand -base64 32>
# Leave SHIPROCKET_API_KEY and SHIPROCKET_SECRET_KEY empty until ShipRocket provides them
```

### 4. Build and start

```bash
docker-compose up -d --build
```

> **Note:** The build process automatically runs `pnpm generate` to create GraphQL types from the schema.

### 5. Verify deployment

```bash
# Check container status
docker ps | grep shiprocket

# Check logs
docker logs -f saleor-shiprocket-app

# Test health endpoint
curl https://shiprocket.leemasmart.com/api/health
```

## Install App in Saleor Dashboard

1. Open Saleor Dashboard → Apps → Install External App
2. Enter: `https://shiprocket.leemasmart.com/api/manifest`
3. Grant required permissions:
   - `MANAGE_PRODUCTS`
   - `MANAGE_ORDERS`
   - `MANAGE_CHECKOUTS`
4. Copy the generated app token to your `.env` file (`SALEOR_APP_TOKEN`)
5. Restart: `docker-compose restart`

## Register with ShipRocket

After deployment, provide ShipRocket team with:

**Catalog APIs:**
- Products: `https://shiprocket.leemasmart.com/api/shiprocket/catalog/products`
- Collections: `https://shiprocket.leemasmart.com/api/shiprocket/catalog/collections`
- Products by Collection: `https://shiprocket.leemasmart.com/api/shiprocket/catalog/collections/{id}/products`

**Order Webhook:**
- `https://shiprocket.leemasmart.com/api/shiprocket/webhooks/order-placed`

They will provide `SHIPROCKET_API_KEY` and `SHIPROCKET_SECRET_KEY` - add these to your `.env`.

## Common Commands

```bash
# Restart
docker-compose restart

# Rebuild after code changes
git pull
docker-compose up -d --build

# View logs
docker logs -f saleor-shiprocket-app

# Stop
docker-compose down
```

## Troubleshooting

**Container not starting:**
- Check logs: `docker logs saleor-shiprocket-app`
- Verify leemasmart-network exists: `docker network ls | grep leemasmart`

**SSL not working:**
- Traefik handles SSL automatically
- Check Traefik logs: `docker logs leemasmart-traefik`
- Verify DNS: `dig shiprocket.leemasmart.com`

**Cannot connect to Saleor:**
- Verify Saleor is running: `curl https://saleor.leemasmart.com/graphql/`
- Check CORS settings in Saleor
