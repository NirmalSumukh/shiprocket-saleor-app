import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/saleor-app-checkout/backend/saleor';
import { CatalogService } from '@/lib/shiprocket/catalog-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * GET /api/shiprocket/catalog/collections/[collectionId]/products
 * 
 * ShipRocket calls this to fetch products in a specific collection
 * Query params: page, limit, channel
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { collectionId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
    const channel = (req.query.channel as string) || 'default-channel';

    if (!collectionId || typeof collectionId !== 'string') {
      return res.status(400).json({ error: 'Collection ID is required' });
    }

    logger.info(
      `ShipRocket catalog request: products for collection ${collectionId}, page=${page}, limit=${limit}`
    );

    const saleorApiUrl = process.env.SALEOR_API_URL || '';
    const client = createClient(saleorApiUrl, async () => ({
      token: process.env.SALEOR_APP_TOKEN || '',
    }));

    const catalogService = new CatalogService(client);
    const response = await catalogService.fetchProductsByCollection(
      collectionId,
      page,
      limit,
      channel
    );

    logger.info(`Returning ${response.products.length} products for collection`);

    return res.status(200).json(response);
  } catch (error: any) {
    logger.error('Catalog products by collection API error', error);
    return res.status(500).json({
      error: 'Failed to fetch products by collection',
      message: error.message,
    });
  }
}
