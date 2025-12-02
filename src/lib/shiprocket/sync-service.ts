import { shiprocketClient, ShiprocketProductPayload, ShiprocketCollectionPayload } from './client';
import { mapSaleorProductToShipRocket, mapSaleorCollectionToShipRocket } from './mappers';
import { logger } from './logger';

export class SyncService {
  /**
   * Sync product update to ShipRocket
   */
  async syncProductToShipRocket(saleorProduct: any): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info('Syncing product to ShipRocket', {
        productId: saleorProduct.id,
        productName: saleorProduct.name,
      });

      // Map Saleor product to ShipRocket format
      const shiprocketPayload = mapSaleorProductToShipRocket(saleorProduct);

      // Validate payload
      if (!shiprocketPayload.variants || shiprocketPayload.variants.length === 0) {
        logger.warn('Product has no variants, skipping sync', {
          productId: saleorProduct.id,
        });
        return { success: false, error: 'Product has no variants' };
      }

      // Send to ShipRocket
      await shiprocketClient.syncProduct(shiprocketPayload);

      logger.info('Successfully synced product to ShipRocket', {
        productId: saleorProduct.id,
        variantCount: shiprocketPayload.variants.length,
      });

      return { success: true };
    } catch (error: any) {
      logger.error('Failed to sync product to ShipRocket', {
        productId: saleorProduct.id,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync collection update to ShipRocket
   */
  async syncCollectionToShipRocket(
    saleorCollection: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info('Syncing collection to ShipRocket', {
        collectionId: saleorCollection.id,
        collectionName: saleorCollection.name,
      });

      // Map Saleor collection to ShipRocket format
      const shiprocketPayload = mapSaleorCollectionToShipRocket(saleorCollection);

      // Send to ShipRocket
      await shiprocketClient.syncCollection(shiprocketPayload);

      logger.info('Successfully synced collection to ShipRocket', {
        collectionId: saleorCollection.id,
      });

      return { success: true };
    } catch (error: any) {
      logger.error('Failed to sync collection to ShipRocket', {
        collectionId: saleorCollection.id,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  /**
   * Batch sync multiple products
   */
  async batchSyncProducts(
    products: any[]
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    logger.info('Starting batch product sync', { count: products.length });

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const product of products) {
      const result = await this.syncProductToShipRocket(product);
      
      if (result.success) {
        successCount++;
      } else {
        failedCount++;
        if (result.error) {
          errors.push(`${product.id}: ${result.error}`);
        }
      }

      // Add small delay to avoid rate limiting
      await this.delay(100);
    }

    logger.info('Batch product sync complete', {
      total: products.length,
      success: successCount,
      failed: failedCount,
    });

    return { success: successCount, failed: failedCount, errors };
  }

  /**
   * Batch sync multiple collections
   */
  async batchSyncCollections(
    collections: any[]
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    logger.info('Starting batch collection sync', { count: collections.length });

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const collection of collections) {
      const result = await this.syncCollectionToShipRocket(collection);
      
      if (result.success) {
        successCount++;
      } else {
        failedCount++;
        if (result.error) {
          errors.push(`${collection.id}: ${result.error}`);
        }
      }

      // Add small delay to avoid rate limiting
      await this.delay(100);
    }

    logger.info('Batch collection sync complete', {
      total: collections.length,
      success: successCount,
      failed: failedCount,
    });

    return { success: successCount, failed: failedCount, errors };
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const syncService = new SyncService();
