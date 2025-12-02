import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/shiprocket/catalog/test
 * 
 * Test endpoint to verify catalog API is accessible
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    message: 'ShipRocket Catalog API is running',
    endpoints: {
      products: `${process.env.NEXT_PUBLIC_APP_URL}/api/shiprocket/catalog/products`,
      collections: `${process.env.NEXT_PUBLIC_APP_URL}/api/shiprocket/catalog/collections`,
      productsByCollection: `${process.env.NEXT_PUBLIC_APP_URL}/api/shiprocket/catalog/collections/{collectionId}/products`,
    },
    timestamp: new Date().toISOString(),
  });
}
