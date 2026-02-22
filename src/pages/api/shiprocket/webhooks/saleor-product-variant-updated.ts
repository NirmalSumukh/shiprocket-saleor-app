import { SaleorAsyncWebhook } from '@saleor/app-sdk/handlers/next';
import { saleorApp } from '@/saleor-app';
import { syncService } from '@/lib/shiprocket/sync-service';
import { logger } from '@/lib/shiprocket/logger';
import { verifySignatureWithFreshJwks } from '@/lib/verify-signature';

/**
 * Saleor webhook for PRODUCT_VARIANT_UPDATED events.
 * Uses the official SDK to verify JWS signatures via JWKS.
 */
export const productVariantUpdatedWebhook = new SaleorAsyncWebhook({
  name: 'Product Variant Updated - Sync to ShipRocket',
  webhookPath: 'api/shiprocket/webhooks/saleor-product-variant-updated',
  event: 'PRODUCT_VARIANT_UPDATED',
  isActive: true,
  apl: saleorApp.apl,
  query: ``,
  verifySignatureFn: verifySignatureWithFreshJwks,
});

export default productVariantUpdatedWebhook.createHandler(async (req, res, ctx) => {
  const payload: any = ctx.payload;
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

  try {
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
    return res.status(200).json({ success: true, message: 'Product synced to ShipRocket after variant update' });
  } catch (error: any) {
    logger.error('Variant webhook processing error', error);
    return res.status(200).json({ success: false, error: 'Internal error', message: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};
