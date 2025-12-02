import { NextApiRequest, NextApiResponse } from 'next';
import { syncService } from '@/lib/shiprocket/sync-service';
import { logger } from '@/lib/shiprocket/logger';
import { verifyWebhookSignature } from '@/lib/saleor-webhook-signature';

/**
 * POST /api/webhooks/saleor-collection-updated
 * 
 * Saleor calls this when a collection is updated
 * Pushes the update to ShipRocket
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

    // Step 2: Extract collection data
    const payload = req.body;
    const collection = payload?.collection;

    if (!collection || !collection.id) {
      logger.warn('Invalid collection webhook payload', payload);
      return res.status(400).json({ error: 'Invalid payload' });
    }

    logger.info('Received collection update webhook from Saleor', {
      collectionId: collection.id,
      collectionName: collection.name,
    });

    // Step 3: Sync to ShipRocket
    const result = await syncService.syncCollectionToShipRocket(collection);

    if (!result.success) {
      logger.error('Failed to sync collection to ShipRocket', {
        collectionId: collection.id,
        error: result.error,
      });
      
      return res.status(200).json({
        success: false,
        error: result.error,
        message: 'Sync failed but webhook acknowledged',
      });
    }

    logger.info('Successfully synced collection to ShipRocket', {
      collectionId: collection.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Collection synced to ShipRocket',
    });
  } catch (error: any) {
    logger.error('Collection webhook processing error', error);
    
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
