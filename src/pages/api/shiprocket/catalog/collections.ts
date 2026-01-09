import { NextApiRequest, NextApiResponse } from 'next';
import { createClientWithToken } from '@/lib/saleor/create-client';
import { CatalogService } from '@/lib/shiprocket/catalog-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * GET /api/shiprocket/catalog/collections
 * 
 * Returns Saleor CATEGORIES formatted as ShipRocket "collections"
 * NOTE: Saleor collections are promotional, so we use categories for product structure
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers to prevent HTML error responses
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
    const channel = (req.query.channel as string) || process.env.DEFAULT_CHANNEL || 'default-channel';

    logger.info(`ShipRocket catalog request: collections (categories) page=${page}, limit=${limit}, channel=${channel}`);

    // Get config from env (synchronous)
    const saleorApiUrl = process.env.SALEOR_API_URL;
    const saleorAppToken = process.env.SALEOR_APP_TOKEN;

    if (!saleorApiUrl || !saleorAppToken) {
      logger.error('Missing Saleor configuration');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Saleor API configuration missing',
      });
    }

    // Create client with token (no async needed!)
    const client = createClientWithToken(saleorApiUrl, saleorAppToken);

    const catalogService = new CatalogService(client);
    // Use fetchCategories instead of fetchCollections
    const response = await catalogService.fetchCategories(page, limit, channel);

    logger.info(`Returning ${response.collections.length} categories as collections`);
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error('Catalog collections API error', error);
    return res.status(500).json({
      error: 'Failed to fetch collections',
      message: error.message,
    });
  }
}

