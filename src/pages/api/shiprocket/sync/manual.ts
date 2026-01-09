import { NextApiRequest, NextApiResponse } from 'next';
import { createClientWithToken } from '@/lib/saleor/create-client';
import { CatalogService } from '@/lib/shiprocket/catalog-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * POST /api/shiprocket/sync/manual
 * 
 * Trigger a manual sync of products from Saleor
 * Useful for initial data population and debugging
 * 
 * Query params: channel (optional, defaults to 'default-channel')
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Allow both GET and POST for convenience
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const channel = (req.query.channel as string) || 'default-channel';

        logger.info('Manual sync triggered', { channel });

        // Get Saleor API configuration
        const saleorApiUrl = process.env.SALEOR_API_URL;
        const saleorAppToken = process.env.SALEOR_APP_TOKEN;

        if (!saleorApiUrl || !saleorAppToken) {
            logger.error('Missing Saleor configuration for manual sync');
            return res.status(500).json({
                error: 'Server configuration error',
                message: 'Saleor API configuration missing',
                debug: {
                    hasApiUrl: !!saleorApiUrl,
                    hasToken: !!saleorAppToken,
                }
            });
        }

        // Create Saleor client
        const client = createClientWithToken(saleorApiUrl, saleorAppToken);
        const catalogService = new CatalogService(client);

        // Fetch products to verify connection
        logger.info('Fetching products from Saleor...');
        const productsResponse = await catalogService.fetchProducts(1, 100, channel);

        // Fetch categories to verify connection
        logger.info('Fetching categories from Saleor...');
        const categoriesResponse = await catalogService.fetchCategories(1, 100);

        const result = {
            success: true,
            message: 'Manual sync completed',
            channel,
            counts: {
                products: productsResponse.pagination.total_count,
                categories: categoriesResponse.pagination.total_count,
            },
            sample: {
                products: productsResponse.products.slice(0, 3).map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    variants: p.variants?.length || 0,
                })),
                categories: categoriesResponse.collections.slice(0, 3).map((c: any) => ({
                    id: c.id,
                    title: c.title,
                })),
            },
        };

        logger.info('Manual sync result', result);

        return res.status(200).json(result);
    } catch (error: any) {
        logger.error('Manual sync error', error);
        return res.status(500).json({
            success: false,
            error: 'Manual sync failed',
            message: error.message,
        });
    }
}
