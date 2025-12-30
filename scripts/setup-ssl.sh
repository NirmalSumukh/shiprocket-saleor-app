#!/bin/bash

# ============================================
# SSL Certificate Setup Script for Hostinger
# ============================================
# Run this script ONCE on your Hostinger VPS to obtain SSL certificates
# Prerequisites: Docker and Docker Compose installed

set -e

# Configuration
DOMAIN="shiprocket.leemasmart.com"
EMAIL="your-email@example.com"  # Change this to your email

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}SSL Certificate Setup for ${DOMAIN}${NC}"
echo -e "${YELLOW}========================================${NC}"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run this script as root or with sudo${NC}"
    exit 1
fi

# Create required directories
echo -e "\n${GREEN}Creating directories...${NC}"
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Create a temporary nginx config (HTTP only, for initial certificate)
echo -e "\n${GREEN}Creating temporary Nginx config for certificate validation...${NC}"
cat > ./nginx/conf.d/shiprocket.conf << 'EOF'
# Temporary HTTP-only config for certificate generation
server {
    listen 80;
    listen [::]:80;
    server_name shiprocket.leemasmart.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Waiting for SSL certificate...';
        add_header Content-Type text/plain;
    }
}
EOF

# Start nginx (HTTP only)
echo -e "\n${GREEN}Starting Nginx in HTTP-only mode...${NC}"
docker-compose up -d nginx

# Wait for nginx to start
sleep 5

# Obtain SSL certificate
echo -e "\n${GREEN}Obtaining SSL certificate from Let's Encrypt...${NC}"
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email ${EMAIL} \
    --agree-tos \
    --no-eff-email \
    -d ${DOMAIN}

# Check if certificate was obtained
if [ -f "./certbot/conf/live/${DOMAIN}/fullchain.pem" ]; then
    echo -e "\n${GREEN}✓ SSL Certificate obtained successfully!${NC}"
else
    echo -e "\n${RED}✗ Failed to obtain SSL certificate${NC}"
    echo -e "${YELLOW}Make sure:${NC}"
    echo -e "  1. Domain ${DOMAIN} points to this server's IP"
    echo -e "  2. Port 80 is open in firewall"
    echo -e "  3. No other service is using port 80"
    exit 1
fi

# Restore the HTTPS nginx config
echo -e "\n${GREEN}Restoring HTTPS Nginx configuration...${NC}"
cat > ./nginx/conf.d/shiprocket.conf << 'EOF'
# ============================================
# HTTP Server - Redirect to HTTPS & Certbot challenge
# ============================================
server {
    listen 80;
    listen [::]:80;
    server_name shiprocket.leemasmart.com;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# ============================================
# HTTPS Server - Main Application
# ============================================
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name shiprocket.leemasmart.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/shiprocket.leemasmart.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/shiprocket.leemasmart.com/privkey.pem;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Proxy to Next.js app
    location / {
        proxy_pass http://app:3010;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Forward headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
        
        # Cache bypass
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://app:3010/api/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 5s;
        proxy_read_timeout 5s;
    }
}
EOF

# Restart all services
echo -e "\n${GREEN}Starting all services...${NC}"
docker-compose down
docker-compose up -d --build

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nYour app should now be accessible at:"
echo -e "  ${YELLOW}https://${DOMAIN}${NC}"
echo -e "\nTo check logs:"
echo -e "  docker-compose logs -f"
echo -e "\nTo check status:"
echo -e "  docker-compose ps"
