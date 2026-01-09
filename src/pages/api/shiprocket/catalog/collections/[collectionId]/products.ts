import { NextApiRequest, NextApiResponse } from 'next';
import { createClientWithToken } from '@/lib/saleor/create-client';
import { CatalogService } from '@/lib/shiprocket/catalog-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * GET /api/shiprocket/catalog/collections/[collectionId]/products
 * 
 * ShipRocket calls this to fetch products in a specific collection (category)
 * NOTE: collectionId is actually a Saleor CATEGORY ID since we expose categories as collections
 * Query params: page, limit, channel
 * Route params: collectionId (actually categoryId)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract route parameter (this is actually a category ID)
    const { collectionId } = req.query;
    const categoryId = collectionId as string;

    // Validate category ID
    if (!categoryId || typeof categoryId !== 'string') {
      return res.status(400).json({ error: 'Collection ID is required' });
    }

    // Extract query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
    const channel = (req.query.channel as string) || process.env.DEFAULT_CHANNEL || 'default-channel';

    logger.info(
      `ShipRocket catalog request: products for category ${categoryId}, page=${page}, limit=${limit}, channel=${channel}`
    );

    // Get Saleor API configuration
    const saleorApiUrl = process.env.SALEOR_API_URL;
    const saleorAppToken = process.env.SALEOR_APP_TOKEN;

    if (!saleorApiUrl || !saleorAppToken) {
      logger.error('Missing Saleor configuration');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Saleor API configuration missing',
      });
    }

    // Create authenticated client
    const client = createClientWithToken(saleorApiUrl, saleorAppToken);

    // Fetch products by category (not collection!)
    const catalogService = new CatalogService(client);
    const response = await catalogService.fetchProductsByCategory(
      categoryId,
      page,
      limit,
      channel
    );

    logger.info(`Returning ${response.products.length} products for category ${categoryId}`);

    return res.status(200).json(response);
  } catch (error: any) {
    logger.error('Catalog products by collection API error', error);
    return res.status(500).json({
      error: 'Failed to fetch products by collection',
      message: error.message,
    });
  }
}

