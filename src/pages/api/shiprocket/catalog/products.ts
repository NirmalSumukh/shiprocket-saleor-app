import { NextApiRequest, NextApiResponse } from 'next';
import { createClientWithToken } from '@/lib/saleor/create-client';
import { CatalogService } from '@/lib/shiprocket/catalog-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * GET /api/shiprocket/catalog/products
 * 
 * ShipRocket calls this endpoint to fetch products
 * Query params: page, limit, channel
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
    const channel = (req.query.channel as string) || 'default-channel';

    logger.info(`ShipRocket catalog request: products page=${page}, limit=${limit}, channel=${channel}`);

    // Get Saleor API configuration from environment
    const saleorApiUrl = process.env.SALEOR_API_URL;
    const saleorAppToken = process.env.SALEOR_APP_TOKEN;

    if (!saleorApiUrl || !saleorAppToken) {
      logger.error('Missing Saleor configuration', {
        hasApiUrl: !!saleorApiUrl,
        hasToken: !!saleorAppToken
      });
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Saleor API configuration missing',
      });
    }

    // Create authenticated Saleor GraphQL client
    const client = createClientWithToken(saleorApiUrl, saleorAppToken);

    // Fetch products using catalog service
    const catalogService = new CatalogService(client);
    const response = await catalogService.fetchProducts(page, limit, channel);

    logger.info(`Returning ${response.products.length} products (total: ${response.pagination.total_count})`);

    return res.status(200).json(response);
  } catch (error: any) {
    logger.error('Catalog products API error', error);
    return res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message,
    });
  }
}

