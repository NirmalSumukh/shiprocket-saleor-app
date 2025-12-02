import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/lib/shiprocket/logger';

/**
 * GET /api/shiprocket/sync/status
 * 
 * Get sync status and statistics
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // In a real implementation, fetch from database or cache
    // This is a placeholder response
    return res.status(200).json({
      success: true,
      status: 'active',
      last_sync: {
        products: new Date().toISOString(),
        collections: new Date().toISOString(),
      },
      statistics: {
        total_products_synced: 0,
        total_collections_synced: 0,
        failed_syncs: 0,
      },
      webhook_status: {
        product_updated: 'active',
        variant_updated: 'active',
        collection_updated: 'active',
      },
    });
  } catch (error: any) {
    logger.error('Failed to fetch sync status', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
