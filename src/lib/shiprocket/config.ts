/**
 * ShipRocket Configuration
 * Centralized configuration for all ShipRocket API interactions
 */

export const shiprocketConfig = {
  apiKey: process.env.SHIPROCKET_API_KEY!,
  secretKey: process.env.SHIPROCKET_SECRET_KEY!,
  baseUrl: process.env.SHIPROCKET_API_BASE_URL || 'https://checkout-api.shiprocket.com',
  
  endpoints: {
    accessToken: '/api/v1/access-token/checkout',
    productWebhook: '/wh/v1/custom/product',
    collectionWebhook: '/wh/v1/custom/collection',
    orderDetails: '/api/v1/custom-platform-order/details',
  },
  
  // Pagination defaults
  defaultPageSize: 100,
  maxPageSize: 100,
} as const;

/**
 * Validate required environment variables
 */
export function validateShiprocketConfig(): void {
  const required = ['SHIPROCKET_API_KEY', 'SHIPROCKET_SECRET_KEY'];
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required ShipRocket environment variables: ${missing.join(', ')}`
    );
  }
}
