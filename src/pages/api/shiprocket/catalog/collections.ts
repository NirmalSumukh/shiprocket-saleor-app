import { NextApiRequest, NextApiResponse } from 'next';
import { createClientWithToken } from '@/lib/saleor/create-client';
import { CatalogService } from '@/lib/shiprocket/catalog-service';
import { logger } from '@/lib/shiprocket/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
    const channel = (req.query.channel as string) || 'default-channel';

    // Get config from env (synchronous)
    const saleorApiUrl = process.env.SALEOR_API_URL;
    const saleorAppToken = process.env.SALEOR_APP_TOKEN;

    if (!saleorApiUrl || !saleorAppToken) {
      throw new Error('Saleor configuration missing');
    }

    // Create client with token (no async needed!)
    const client = createClientWithToken(saleorApiUrl, saleorAppToken);

    const catalogService = new CatalogService(client);
    const response = await catalogService.fetchCollections(page, limit, channel);

    logger.info(`Returning ${response.collections.length} collections`);
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error('Catalog collections API error', error);
    return res.status(500).json({
      error: 'Failed to fetch collections',
      message: error.message,
    });
  }
}
