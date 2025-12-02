import { NextApiRequest, NextApiResponse } from 'next';
import { syncService } from '@/lib/shiprocket/sync-service';
import { logger } from '@/lib/shiprocket/logger';
import { verifyWebhookSignature } from '@/lib/saleor-webhook-signature';

/**
 * POST /api/webhooks/saleor-product-variant-updated
 * 
 * Saleor calls this when a product variant is updated
 * Syncs the entire product (with all variants) to ShipRocket
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Step 1: Verify webhook signature
    const signature = req.headers['saleor-signature'] as string;
    
    if (!verifyWebhookSignature(req.body, signature)) {
      logger.warn('Invalid Saleor webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Step 2: Extract variant data
    const payload = req.body;
    const variant = payload?.productVariant;
    const product = variant?.product;

    if (!product || !product.id) {
      logger.warn('Invalid variant webhook payload', payload);
      return res.status(400).json({ error: 'Invalid payload' });
    }

    logger.info('Received variant update webhook from Saleor', {
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
    });

    // Step 3: Sync entire product (ShipRocket doesn't have separate variant endpoint)
    const result = await syncService.syncProductToShipRocket(product);

    if (!result.success) {
      logger.error('Failed to sync product after variant update', {
        variantId: variant.id,
        productId: product.id,
        error: result.error,
      });
      
      return res.status(200).json({
        success: false,
        error: result.error,
        message: 'Sync failed but webhook acknowledged',
      });
    }

    logger.info('Successfully synced product after variant update', {
      variantId: variant.id,
      productId: product.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Product synced to ShipRocket after variant update',
    });
  } catch (error: any) {
    logger.error('Variant webhook processing error', error);
    
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
