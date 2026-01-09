import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/lib/shiprocket/logger';

/**
 * POST /api/shiprocket/webhooks/saleor-category-updated
 * 
 * Saleor calls this when a category is created or updated
 * Since we expose categories as collections to ShipRocket, we log the update
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, saleor-signature');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract category data from webhook payload
        const payload = req.body;
        const category = payload?.category;

        if (!category || !category.id) {
            logger.warn('Invalid category webhook payload', payload);
            return res.status(400).json({ error: 'Invalid payload' });
        }

        logger.info('Received category update webhook from Saleor', {
            categoryId: category.id,
            categoryName: category.name,
        });

        // Categories are served directly from Saleor via fetchCategories()
        // No need to sync to external service since ShipRocket pulls from our API

        logger.info('Category update acknowledged', {
            categoryId: category.id,
        });

        return res.status(200).json({
            success: true,
            message: 'Category update acknowledged',
        });
    } catch (error: any) {
        logger.error('Category webhook processing error', error);

        // Return 200 to prevent infinite retries
        return res.status(200).json({
            success: false,
            error: 'Internal error',
            message: error.message,
        });
    }
}

export const config = {
    api: {
        bodyParser: true,
    },
};
