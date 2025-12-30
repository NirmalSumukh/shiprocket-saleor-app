# ShipRocket Saleor App

Complete integration between Saleor e-commerce platform and ShipRocket Checkout for Indian D2C brands.

## Features

✅ **Secure Checkout** - API credentials never exposed to frontend
✅ **Bi-directional Sync** - Real-time catalog synchronization
✅ **Automatic Order Creation** - Orders flow seamlessly from ShipRocket to Saleor
✅ **Webhook-based Updates** - Instant product/collection sync
✅ **Payment Support** - COD and Prepaid orders
✅ **Rate Limiting** - Protection against abuse
✅ **Comprehensive Logging** - Full audit trail

---

## Architecture

┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ │ │ │ │ │
│ Storefront │◄───────►│ Saleor App │◄───────►│ ShipRocket │
│ │ │ (Middleware)│ │ │
└─────────────┘ └──────────────┘ └─────────────┘
│
▼
┌──────────────┐
│ │
│ Saleor │
│ GraphQL │
│ │
└──────────────┘

text

---

## Installation

### 1. Prerequisites

- Node.js 20+
- pnpm 8+
- Saleor instance (3.14+)
- ShipRocket account with API credentials

### 2. Clone & Install

git clone <your-repo-url>
cd saleor-shiprocket-app
pnpm install

text

### 3. Environment Setup

cp .env.example .env

text

Edit `.env` and configure:

ShipRocket Credentials
SHIPROCKET_API_KEY=your_api_key
SHIPROCKET_SECRET_KEY=your_secret_key

Saleor Configuration
SALEOR_API_URL=https://your-saleor.com/graphql/
SALEOR_APP_TOKEN=your_app_token

App URLs
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
STOREFRONT_URL=https://your-store.com

Security
SECRET_KEY=random-secret-min-8-chars

text

### 4. Generate GraphQL Types

pnpm generate

text

### 5. Validate Configuration

pnpm shiprocket:validate

text

### 6. Run Development Server

pnpm dev

text

Visit: http://localhost:3000

---

## Configuration with ShipRocket

### Step 1: Register Catalog APIs

Provide these endpoints to ShipRocket team:

Products: https://your-app.com/api/shiprocket/catalog/products?page=1&limit=100
Collections: https://your-app.com/api/shiprocket/catalog/collections?page=1&limit=100
Products by Collection: https://your-app.com/api/shiprocket/catalog/collections/{id}/products?page=1&limit=100

text

### Step 2: Register Webhook

Provide this webhook URL to ShipRocket:

Order Webhook: https://your-app.com/api/shiprocket/webhooks/order-placed

text

### Step 3: Receive API Credentials

ShipRocket will provide:
- API Key
- Secret Key

Add these to your `.env` file.

---

## Installation in Saleor

### 1. Install App

From Saleor Dashboard
Apps → Install External App → Enter your app URL

text

### 2. Grant Permissions

The app requires:
- `MANAGE_PRODUCTS` - For catalog sync
- `MANAGE_ORDERS` - For order creation
- `MANAGE_CHECKOUTS` - For checkout flow

### 3. Verify Webhooks

Check Saleor Dashboard → Apps → ShipRocket App → Webhooks

Should show:
- Product Updated
- Product Variant Updated
- Collection Updated

---

## Frontend Integration

### 1. Add ShipRocket Script

<!-- In your storefront layout/head --> <script src="https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js"></script> <link rel="stylesheet" href="https://checkout-ui.shiprocket.com/assets/styles/shopify.css"> ```
2. Implement Checkout Button
text
// components/CheckoutButton.tsx
import { useState } from 'react';

export function CheckoutButton({ cartItems }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Call your Saleor App API
      const response = await fetch('/api/shiprocket/checkout/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_data: {
            items: cartItems.map(item => ({
              variant_id: item.variantId,
              quantity: item.quantity,
            })),
          },
          redirect_url: `${window.location.origin}/order-success`,
        }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      // Initialize ShipRocket checkout
      window.HeadlessCheckout.addToCart(null, data.token, {
        fallbackUrl: `${window.location.origin}/checkout-fallback`,
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg"
    >
      {loading ? 'Loading...' : 'Proceed to Checkout'}
    </button>
  );
}
3. Add Hidden Domain Input
text
<input type="hidden" value="your-store.com" id="sellerDomain"/>
API Endpoints
Catalog APIs (Called by ShipRocket)
Endpoint	Method	Description
/api/shiprocket/catalog/products	GET	Fetch products with pagination
/api/shiprocket/catalog/collections	GET	Fetch collections with pagination
/api/shiprocket/catalog/collections/{id}/products	GET	Fetch products in collection
Checkout APIs (Called by Frontend)
Endpoint	Method	Description
/api/shiprocket/checkout/authorize	POST	Generate checkout token
/api/shiprocket/checkout/order/{id}	GET	Fetch order details
Webhook APIs
Endpoint	Method	Description
/api/shiprocket/webhooks/order-placed	POST	Receive order from ShipRocket
/api/webhooks/saleor-product-updated	POST	Sync product to ShipRocket
/api/webhooks/saleor-product-variant-updated	POST	Sync variant to ShipRocket
/api/webhooks/saleor-collection-updated	POST	Sync collection to ShipRocket
Admin APIs
Endpoint	Method	Description
/api/shiprocket/sync/bulk	POST	Manual bulk catalog sync
/api/shiprocket/sync/status	GET	Get sync status
/api/health	GET	Health check
Testing
Run Tests
text
pnpm test
Manual Testing Checklist
 Catalog sync works (ShipRocket can fetch products/collections)

 Checkout token generation works

 Order webhook creates order in Saleor

 Product updates sync to ShipRocket

 COD orders marked correctly

 Prepaid orders marked as paid

Test Webhook Locally
Use ngrok or similar:

text
ngrok http 3000
Update webhook URLs to ngrok URL for testing.

Deployment
Vercel (Recommended)
text
vercel --prod
Docker
text
docker build -t saleor-shiprocket-app .
docker run -p 3000:3000 --env-file .env saleor-shiprocket-app
Environment Variables in Production
Ensure all production environment variables are set in your hosting platform.

Monitoring & Logging
Health Check
text
curl https://your-app.com/api/health
Sync Status
text
curl -H "Authorization: Bearer YOUR_SECRET_KEY" \
  https://your-app.com/api/shiprocket/sync/status
Logs
Check application logs for:

[ShipRocket Info] - Normal operations

[ShipRocket Warn] - Potential issues

[ShipRocket Error] - Critical errors

Troubleshooting
Orders Not Creating in Saleor
Check webhook logs in ShipRocket dashboard

Verify webhook URL is correct

Check HMAC signature verification

Review app logs for errors

Products Not Syncing to ShipRocket
Verify Saleor webhooks are active

Check network connectivity

Validate ShipRocket API credentials

Review sync logs

Checkout Token Generation Fails
Verify ShipRocket API credentials

Check HMAC generation

Validate cart data format

Review rate limiting

Security Best Practices
✅ Never commit .env file
✅ Rotate API keys periodically
✅ Use HTTPS in production
✅ Implement rate limiting
✅ Verify webhook signatures
✅ Restrict CORS to your domains
✅ Use environment-specific secrets

Support
For issues or questions:

Open GitHub issue

Check Saleor documentation: https://docs.saleor.io

Check ShipRocket documentation: [provided by ShipRocket]

License
MIT

text

***

## 6.8 Quick Start Guide

**File: `QUICKSTART.md`**

```markdown
# Quick Start Guide

Get ShipRocket integrated with Saleor in 15 minutes.

## Step 1: Clone & Setup (2 min)

git clone <repo-url>
cd saleor-shiprocket-app
pnpm install
cp .env.example .env

text

## Step 2: Configure (3 min)

Edit `.env`:

SHIPROCKET_API_KEY=<from-shiprocket>
SHIPROCKET_SECRET_KEY=<from-shiprocket>
SALEOR_API_URL=https://your-saleor.com/graphql/
NEXT_PUBLIC_APP_URL=http://localhost:3000
STOREFRONT_URL=http://localhost:3001
SECRET_KEY=random-secret-123

text

## Step 3: Generate Types (1 min)

pnpm generate

text

## Step 4: Start Development (1 min)

pnpm dev

text

App runs at: http://localhost:3000

## Step 5: Install in Saleor (3 min)

1. Open Saleor Dashboard
2. Go to Apps → Install External App
3. Enter: `http://localhost:3000/api/manifest`
4. Grant permissions
5. Done!

## Step 6: Configure ShipRocket (5 min)

Contact ShipRocket support and provide:

**Catalog APIs:**
- Products: `http://localhost:3000/api/shiprocket/catalog/products`
- Collections: `http://localhost:3000/api/shiprocket/catalog/collections`
- Products by Collection: `http://localhost:3000/api/shiprocket/catalog/collections/{id}/products`

**Order Webhook:**
- `http://localhost:3000/api/shiprocket/webhooks/order-placed`

**For production, replace localhost with your deployed URL**

## You're Done! 🎉

Test checkout flow:
1. Add products to cart in your storefront
2. Click checkout
3. Complete payment in ShipRocket
4. Order appears in Saleor Dashboard

---

## Next Steps

- [Read full documentation](./README.md)
- [Configure production deployment](./DEPLOYMENT.md)
- [Set up monitoring](./MONITORING.md)
6.9 Deployment Guide
File: DEPLOYMENT.md

text
# Deployment Guide

## Production Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Webhook signatures verified
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Health checks configured
- [ ] Backup strategy in place

---

## Deploy to Vercel

### 1. Install Vercel CLI

npm i -g vercel

text

### 2. Deploy

vercel --prod

text

### 3. Set Environment Variables

vercel env add SHIPROCKET_API_KEY
vercel env add SHIPROCKET_SECRET_KEY
vercel env add SALEOR_API_URL
vercel env add SALEOR_APP_TOKEN
vercel env add SECRET_KEY
vercel env add STOREFRONT_URL

text

### 4. Update URLs

Update in ShipRocket and Saleor:
- Replace localhost URLs with Vercel URL
- Re-register webhooks

---

## Deploy with Docker

### 1. Build Image

docker build -t saleor-shiprocket-app .

text

### 2. Run Container

docker run -d
-p 3000:3000
--env-file .env.production
--name shiprocket-app
saleor-shiprocket-app

text

### 3. Use Docker Compose

docker-compose.yml
version: '3.8'
services:
app:
build: .
ports:
- "3000:3000"
env_file:
- .env.production
restart: unless-stopped

text
undefined
docker-compose up -d

text

---

## Post-Deployment

1. **Test Health Check**
curl https://your-app.com/api/health

text

2. **Verify Webhooks**
- Test order webhook with ShipRocket
- Test product sync from Saleor

3. **Monitor Logs**
vercel logs

or
docker logs -f shiprocket-app

text

4. **Set Up Alerts**
Configure monitoring for:
- Failed webhook deliveries
- High error rates
- API timeouts

---

## Scaling Considerations

For high traffic:

1. **Use Redis for Rate Limiting**
npm install ioredis

text

2. **Enable Caching**
- Cache catalog responses (5 min)
- Use CDN for static assets

3. **Database for Webhooks**
- Store webhook history
- Implement proper retry queue

4. **Horizontal Scaling**
- Deploy multiple instances
- Use load balancer