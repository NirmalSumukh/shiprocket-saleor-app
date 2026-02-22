import { SaleorAsyncWebhook } from '@saleor/app-sdk/handlers/next';
import { saleorApp } from '@/saleor-app';
import { syncService } from '@/lib/shiprocket/sync-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * Saleor webhook for COLLECTION_UPDATED events.
 * Uses the official SDK to verify JWS signatures via JWKS.
 */
export const collectionUpdatedWebhook = new SaleorAsyncWebhook({
  name: 'Collection Updated - Sync to ShipRocket',
  webhookPath: 'api/shiprocket/webhooks/saleor-collection-updated',
  event: 'COLLECTION_UPDATED',
  isActive: true,
  apl: saleorApp.apl,
  query: ``,
});

export default collectionUpdatedWebhook.createHandler(async (req, res, ctx) => {
  const payload: any = ctx.payload;
  const collection = payload?.collection;

  if (!collection || !collection.id) {
    logger.warn('Invalid collection webhook payload', payload);
    return res.status(400).json({ error: 'Invalid payload' });
  }

  logger.info('Received collection update webhook from Saleor', {
    collectionId: collection.id,
    collectionName: collection.name,
  });

  try {
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

    logger.info('Successfully synced collection to ShipRocket', { collectionId: collection.id });
    return res.status(200).json({ success: true, message: 'Collection synced to ShipRocket' });
  } catch (error: any) {
    logger.error('Collection webhook processing error', error);
    return res.status(200).json({ success: false, error: 'Internal error', message: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};
