import { NextApiRequest, NextApiResponse } from 'next';
import { createClientWithToken } from '@/lib/saleor/create-client';
import { CatalogService } from '@/lib/shiprocket/catalog-service';
import { syncService } from '@/lib/shiprocket/sync-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * POST /api/sync/bulk
 * 
 * Manually trigger bulk sync of catalog to ShipRocket
 * For initial setup or re-sync after issues
 * 
 * Body: { "type": "products" | "collections" | "all" }
 * 
 * Authentication: Requires Bearer token matching SECRET_KEY
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authentication - require SECRET_KEY as Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.SECRET_KEY}`) {
    logger.warn('Unauthorized bulk sync attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { type = 'all', channel = 'default-channel' } = req.body;

    if (!['products', 'collections', 'all'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid type. Must be "products", "collections", or "all"' 
      });
    }

    logger.info('Starting bulk sync', { type, channel });

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

    // Create authenticated Saleor client
    const client = createClientWithToken(saleorApiUrl, saleorAppToken);
    const catalogService = new CatalogService(client);

    const results: {
      products: any | null;
      collections: any | null;
    } = {
      products: null,
      collections: null,
    };

    // Sync products
    if (type === 'products' || type === 'all') {
      logger.info('Fetching all products for bulk sync');
      
      let allProducts: any[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const productsResponse = await catalogService.fetchProducts(currentPage, 100, channel);
        
        const products = productsResponse.products.map((p: any) => ({
          id: p.id,
          name: p.title,
          description: p.body_html,
          category: { name: p.product_type },
          thumbnail: p.image,
          variants: p.variants,
          updatedAt: p.updated_at,
        }));

        allProducts = allProducts.concat(products);
        
        hasMore = currentPage < productsResponse.pagination.total_pages;
        currentPage++;
        
        logger.info(`Fetched page ${currentPage - 1}/${productsResponse.pagination.total_pages}`);
      }

      logger.info(`Syncing ${allProducts.length} products to ShipRocket`);
      results.products = await syncService.batchSyncProducts(allProducts);
    }

    // Sync collections
    if (type === 'collections' || type === 'all') {
      logger.info('Fetching all collections for bulk sync');
      
      const collectionsResponse = await catalogService.fetchCollections(1, 100, channel);
      
      const collections = collectionsResponse.collections.map((c: any) => ({
        id: c.id,
        name: c.title,
        description: c.body_html,
        backgroundImage: c.image,
      }));

      logger.info(`Syncing ${collections.length} collections to ShipRocket`);
      results.collections = await syncService.batchSyncCollections(collections);
    }

    logger.info('Bulk sync completed successfully', results);

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
