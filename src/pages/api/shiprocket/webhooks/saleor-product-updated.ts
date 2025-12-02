import { NextApiRequest, NextApiResponse } from 'next';
import { syncService } from '@/lib/shiprocket/sync-service';
import { logger } from '@/lib/shiprocket/logger';
import { verifyWebhookSignature } from '@/lib/saleor-webhook-signature';

/**
 * POST /api/webhooks/saleor-product-updated
 * 
 * Saleor calls this when a product is updated
 * Pushes the update to ShipRocket
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Step 1: Verify webhook signature from Saleor
    const signature = req.headers['saleor-signature'] as string;
    
    if (!verifyWebhookSignature(req.body, signature)) {
      logger.warn('Invalid Saleor webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Step 2: Extract product data from webhook payload
    const payload = req.body;
    const product = payload?.product;

    if (!product || !product.id) {
      logger.warn('Invalid product webhook payload', payload);
      return res.status(400).json({ error: 'Invalid payload' });
    }

    logger.info('Received product update webhook from Saleor', {
      productId: product.id,
      productName: product.name,
    });

    // Step 3: Sync to ShipRocket
    const result = await syncService.syncProductToShipRocket(product);

    if (!result.success) {
      logger.error('Failed to sync product to ShipRocket', {
        productId: product.id,
        error: result.error,
      });
      
      // Still return 200 to prevent Saleor from retrying
      return res.status(200).json({
        success: false,
        error: result.error,
        message: 'Sync failed but webhook acknowledged',
      });
    }

    logger.info('Successfully synced product to ShipRocket', {
      productId: product.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Product synced to ShipRocket',
    });
  } catch (error: any) {
    logger.error('Product webhook processing error', error);
    
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
