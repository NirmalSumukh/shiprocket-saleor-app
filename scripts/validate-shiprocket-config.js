#!/usr/bin/env node

import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

function validateEnvVars() {
  console.log('🔍 Validating ShipRocket configuration...\n');

  const required = [
    'SALEOR_API_URL',
    'NEXT_PUBLIC_APP_URL',
    'STOREFRONT_URL',
    'SECRET_KEY',
  ];

  const optional = [
    'SHIPROCKET_API_KEY',
    'SHIPROCKET_SECRET_KEY',
  ];

  const missing = [];
  const values = {};

  // Check required
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    } else {
      values[key] = process.env[key];
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\nPlease set these in your .env file\n');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set\n');

  // Check optional ShipRocket
  const hasShipRocket = optional.every(key => process.env[key]);
  
  if (hasShipRocket) {
    console.log('🔐 Testing HMAC generation...');
    const testPayload = { test: 'data' };
    const hmac = crypto
      .createHmac('sha256', process.env.SHIPROCKET_SECRET_KEY)
      .update(JSON.stringify(testPayload))
      .digest('base64');

    console.log(`   Generated HMAC: ${hmac.substring(0, 20)}...\n`);
  } else {
    console.log('⚠️  ShipRocket credentials not set (optional for initial setup)\n');
  }

  // Validate URLs
  console.log('🌐 Validating URLs...');
  
  for (const [key, url] of Object.entries(values)) {
    if (key.includes('URL')) {
      try {
        new URL(url);
        console.log(`   ✅ ${key} is valid`);
      } catch (e) {
        console.error(`   ❌ ${key} is invalid: ${url}`);
      }
    }
  }

  console.log('\n✨ Configuration validation complete!\n');

  // Display endpoint URLs
  console.log('📡 ShipRocket Catalog API Endpoints:');
  console.log(`   Products: ${values.NEXT_PUBLIC_APP_URL}/api/shiprocket/catalog/products`);
  console.log(`   Collections: ${values.NEXT_PUBLIC_APP_URL}/api/shiprocket/catalog/collections`);
  console.log(`   Products by Collection: ${values.NEXT_PUBLIC_APP_URL}/api/shiprocket/catalog/collections/{id}/products\n`);

  console.log('🔗 Webhook Endpoints:');
  console.log(`   Order Placed: ${values.NEXT_PUBLIC_APP_URL}/api/shiprocket/webhooks/order-placed\n`);

  console.log('📥 Saleor Webhook Endpoints (auto-registered):');
  console.log(`   Product Updated: ${values.NEXT_PUBLIC_APP_URL}/api/webhooks/saleor-product-updated`);
  console.log(`   Variant Updated: ${values.NEXT_PUBLIC_APP_URL}/api/webhooks/saleor-product-variant-updated`);
  console.log(`   Collection Updated: ${values.NEXT_PUBLIC_APP_URL}/api/webhooks/saleor-collection-updated\n`);
}

// Run validation
validateEnvVars();
