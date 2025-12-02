import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/saleor-app-checkout/backend/saleor';
import { CatalogService } from '@/lib/shiprocket/catalog-service';
import { syncService } from '@/lib/shiprocket/sync-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * POST /api/shiprocket/sync/bulk
 * 
 * Manually trigger bulk sync of catalog to ShipRocket
 * For initial setup or re-sync after issues
 * 
 * Body: { "type": "products" | "collections" | "all" }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { type = 'all' } = req.body;

    logger.info('Starting bulk sync', { type });

    const saleorApiUrl = process.env.SALEOR_API_URL || '';
    const client = createClient(saleorApiUrl, async () => ({
      token: process.env.SALEOR_APP_TOKEN || '',
    }));

    const catalogService = new CatalogService(client);
    const results: any = {
      products: null,
      collections: null,
    };

    // Sync products
    if (type === 'products' || type === 'all') {
      logger.info('Fetching all products for bulk sync');
      
      const productsResponse = await catalogService.fetchProducts(1, 100);
      const products = productsResponse.products.map((p: any) => ({
        id: p.id,
        name: p.title,
        description: p.body_html,
        category: { name: p.product_type },
        thumbnail: p.image,
        variants: p.variants,
        updatedAt: p.updated_at,
      }));

      results.products = await syncService.batchSyncProducts(products);
    }

    // Sync collections
    if (type === 'collections' || type === 'all') {
      logger.info('Fetching all collections for bulk sync');
      
      const collectionsResponse = await catalogService.fetchCollections(1, 100);
      const collections = collectionsResponse.collections.map((c: any) => ({
        id: c.id,
        name: c.title,
        description: c.body_html,
        backgroundImage: c.image,
      }));

      results.collections = await syncService.batchSyncCollections(collections);
    }

    logger.info('Bulk sync completed', results);

    return res.status(200).json({
      success: true,
      message: 'Bulk sync completed',
      results,
    });
  } catch (error: any) {
    logger.error('Bulk sync failed', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
