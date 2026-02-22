import { SaleorAsyncWebhook } from '@saleor/app-sdk/handlers/next';
import { saleorApp } from '@/saleor-app';
import { syncService } from '@/lib/shiprocket/sync-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * Saleor webhook for PRODUCT_UPDATED and PRODUCT_CREATED events.
 * Uses the official SDK to verify JWS signatures via JWKS.
 */
export const productUpdatedWebhook = new SaleorAsyncWebhook({
  name: 'Product Updated - Sync to ShipRocket',
  webhookPath: 'api/shiprocket/webhooks/saleor-product-updated',
  event: 'PRODUCT_UPDATED',
  isActive: true,
  apl: saleorApp.apl,
  query: ``,
});

export default productUpdatedWebhook.createHandler(async (req, res, ctx) => {
  const payload: any = ctx.payload;
  const product = payload?.product;

  if (!product || !product.id) {
    logger.warn('Invalid product webhook payload', payload);
    return res.status(400).json({ error: 'Invalid payload' });
  }

  logger.info('Received product update webhook from Saleor', {
    productId: product.id,
    productName: product.name,
  });

  try {
    const result = await syncService.syncProductToShipRocket(product);

    if (!result.success) {
      logger.error('Failed to sync product to ShipRocket', {
        productId: product.id,
        error: result.error,
      });
      return res.status(200).json({
        success: false,
        error: result.error,
        message: 'Sync failed but webhook acknowledged',
      });
    }

    logger.info('Successfully synced product to ShipRocket', { productId: product.id });
    return res.status(200).json({ success: true, message: 'Product synced to ShipRocket' });
  } catch (error: any) {
    logger.error('Product webhook processing error', error);
    return res.status(200).json({ success: false, error: 'Internal error', message: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};
