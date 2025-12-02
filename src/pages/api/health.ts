import { NextApiRequest, NextApiResponse } from 'next';
import { validateShiprocketConfig } from '@/lib/shiprocket/config';

/**
 * GET /api/health
 * 
 * Health check endpoint for monitoring
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate configuration
    validateShiprocketConfig();

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      services: {
        shiprocket: {
          configured: !!(process.env.SHIPROCKET_API_KEY && process.env.SHIPROCKET_SECRET_KEY),
          baseUrl: process.env.SHIPROCKET_API_BASE_URL,
        },
        saleor: {
          configured: !!process.env.SALEOR_API_URL,
          apiUrl: process.env.SALEOR_API_URL,
        },
      },
      endpoints: {
        catalog: `${process.env.NEXT_PUBLIC_APP_URL}/api/shiprocket/catalog`,
        checkout: `${process.env.NEXT_PUBLIC_APP_URL}/api/shiprocket/checkout/authorize`,
        webhooks: {
          orderPlaced: `${process.env.NEXT_PUBLIC_APP_URL}/api/shiprocket/webhooks/order-placed`,
          productUpdated: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/saleor-product-updated`,
        },
      },
    };

    return res.status(200).json(health);
  } catch (error: any) {
    return res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
