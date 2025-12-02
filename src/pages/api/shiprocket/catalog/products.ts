import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/saleor-app-checkout/backend/saleor';
import { CatalogService } from '@/lib/shiprocket/catalog-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * GET /api/shiprocket/catalog/products
 * 
 * ShipRocket calls this endpoint to fetch products
 * Query params: page, limit, channel
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
    const channel = (req.query.channel as string) || 'default-channel';

    logger.info(`ShipRocket catalog request: products page=${page}, limit=${limit}`);

    // Create Saleor GraphQL client
    // Note: Adjust based on your app's client creation method
    const saleorApiUrl = process.env.SALEOR_API_URL || '';
    const client = createClient(saleorApiUrl, async () => ({
      token: process.env.SALEOR_APP_TOKEN || '',
    }));

    const catalogService = new CatalogService(client);
    const response = await catalogService.fetchProducts(page, limit, channel);

    logger.info(`Returning ${response.products.length} products`);

    return res.status(200).json(response);
  } catch (error: any) {
    logger.error('Catalog products API error', error);
    return res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message,
    });
  }
}
