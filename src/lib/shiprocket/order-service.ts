import { Client } from 'urql';
import {
  CreateDraftOrderDocument,
  CompleteDraftOrderDocument,
  OrderMarkAsPaidDocument,
  OrderNoteAddDocument,
  UpdateDraftOrderShippingMethodDocument,
  GetVariantDetailsDocument,
  GetShippingMethodsDocument,
} from '../../../generated/graphql';
import { ShiprocketOrderWebhook } from './types';
import { logger } from './logger';

export class OrderService {
  constructor(private client: Client) {}

  /**
   * Create order in Saleor from ShipRocket webhook data
   */
  async createOrderFromWebhook(
    webhookData: ShiprocketOrderWebhook,
    channel: string = 'default-channel'
  ): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> {
    try {
      logger.info('Processing ShipRocket order webhook', {
        shiprocketOrderId: webhookData.order_id,
        itemCount: webhookData.cart_data?.items?.length || 0,
        paymentType: webhookData.payment_type,
      });

      // Step 1: Validate webhook data
      if (webhookData.status !== 'SUCCESS') {
        logger.warn('Order webhook received with non-SUCCESS status', {
          status: webhookData.status,
          orderId: webhookData.order_id,
        });
        return {
          success: false,
          error: `Order status is ${webhookData.status}, not SUCCESS`,
        };
      }

      // Step 2: Build order lines from cart data
      const orderLines = await this.buildOrderLines(
        webhookData.cart_data.items,
        channel
      );

      if (orderLines.length === 0) {
        throw new Error('No valid order lines could be created');
      }

      // Step 3: Create draft order
      const draftOrderResult = await this.createDraftOrder(
        webhookData,
        orderLines,
        channel
      );

      if (!draftOrderResult.success || !draftOrderResult.orderId) {
        throw new Error(draftOrderResult.error || 'Failed to create draft order');
      }

      const orderId = draftOrderResult.orderId;

      // Step 4: Add shipping method (optional, based on your setup)
      await this.addShippingMethod(orderId, channel);

      // Step 5: Complete the draft order
      const completeResult = await this.completeDraftOrder(orderId);

      if (!completeResult.success) {
        throw new Error(completeResult.error || 'Failed to complete draft order');
      }

      // Step 6: Mark as paid if prepaid
      if (webhookData.payment_type === 'PREPAID') {
        await this.markOrderAsPaid(orderId, webhookData.order_id);
      }

      // Step 7: Add ShipRocket order ID as note
      await this.addOrderNote(
        orderId,
        `ShipRocket Order ID: ${webhookData.order_id}\nPayment Type: ${webhookData.payment_type}`
      );

      logger.info('Successfully created order from ShipRocket webhook', {
        saleorOrderId: orderId,
        orderNumber: completeResult.orderNumber,
        shiprocketOrderId: webhookData.order_id,
      });

      return {
        success: true,
        orderId,
        orderNumber: completeResult.orderNumber,
      };
    } catch (error: any) {
      logger.error('Failed to create order from webhook', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Build order lines by fetching variant details from Saleor
   */
  private async buildOrderLines(
    items: Array<{ variant_id: string; quantity: number }>,
    channel: string
  ): Promise<Array<{ variantId: string; quantity: number }>> {
    const lines: Array<{ variantId: string; quantity: number }> = [];

    for (const item of items) {
      try {
        // Fetch variant details to validate it exists
        const result = await this.client
          .query(GetVariantDetailsDocument, {
            id: item.variant_id,
            channel,
          })
          .toPromise();

        if (result.error || !result.data?.productVariant) {
          logger.warn('Variant not found or unavailable', {
            variantId: item.variant_id,
            error: result.error?.message,
          });
          continue;
        }

        const variant = result.data.productVariant;

        // Check stock availability
        if (variant.quantityAvailable !== null && variant.quantityAvailable < item.quantity) {
          logger.warn('Insufficient stock for variant', {
            variantId: item.variant_id,
            requested: item.quantity,
            available: variant.quantityAvailable,
          });
        }

        lines.push({
          variantId: item.variant_id,
          quantity: item.quantity,
        });
      } catch (error: any) {
        logger.error('Error fetching variant details', {
          variantId: item.variant_id,
          error: error.message,
        });
      }
    }

    return lines;
  }

  /**
   * Create draft order in Saleor
   */
  private async createDraftOrder(
    webhookData: ShiprocketOrderWebhook,
    lines: Array<{ variantId: string; quantity: number }>,
    channel: string
  ): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      // Build shipping address
      const shippingAddress = this.buildAddress(webhookData.shipping_address);
      const billingAddress = this.buildAddress(
        webhookData.billing_address || webhookData.shipping_address
      );

      const input = {
        channelId: channel,
        userEmail: webhookData.email,
        shippingAddress,
        billingAddress,
        lines: lines.map((line) => ({
          variantId: line.variantId,
          quantity: line.quantity,
        })),
      };

      const result = await this.client
        .mutation(CreateDraftOrderDocument, { input })
        .toPromise();

      if (result.error || result.data?.draftOrderCreate?.errors?.length) {
        const errorMsg =
          result.error?.message ||
          result.data?.draftOrderCreate?.errors
            ?.map((e: any) => e.message)
            .join(', ');
        return { success: false, error: errorMsg };
      }

      const orderId = result.data?.draftOrderCreate?.order?.id;

      if (!orderId) {
        return { success: false, error: 'No order ID returned' };
      }

      return { success: true, orderId };
    } catch (error: any) {
      logger.error('Error creating draft order', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Complete draft order
   */
  private async completeDraftOrder(
    orderId: string
  ): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
    try {
      const result = await this.client
        .mutation(CompleteDraftOrderDocument, { id: orderId })
        .toPromise();

      if (result.error || result.data?.draftOrderComplete?.errors?.length) {
        const errorMsg =
          result.error?.message ||
          result.data?.draftOrderComplete?.errors
            ?.map((e: any) => e.message)
            .join(', ');
        return { success: false, error: errorMsg };
      }

      const orderNumber = result.data?.draftOrderComplete?.order?.number;

      return { success: true, orderNumber };
    } catch (error: any) {
      logger.error('Error completing draft order', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add default shipping method to order
   */
  private async addShippingMethod(orderId: string, channel: string) {
    try {
      // Fetch available shipping methods
      const result = await this.client
        .query(GetShippingMethodsDocument, { channel })
        .toPromise();

      const shippingMethods =
        result.data?.shippingZones?.edges?.[0]?.node?.shippingMethods;

      if (!shippingMethods || shippingMethods.length === 0) {
        logger.warn('No shipping methods available');
        return;
      }

      // Use first available shipping method
      const shippingMethodId = shippingMethods[0].id;

      await this.client
        .mutation(UpdateDraftOrderShippingMethodDocument, {
          id: orderId,
          shippingMethod: shippingMethodId,
        })
        .toPromise();

      logger.info('Added shipping method to order', { orderId, shippingMethodId });
    } catch (error: any) {
      logger.error('Error adding shipping method', error);
      // Non-critical error, continue
    }
  }

  /**
   * Mark order as paid (for prepaid orders)
   */
  private async markOrderAsPaid(orderId: string, transactionReference: string) {
    try {
      const result = await this.client
        .mutation(OrderMarkAsPaidDocument, {
          id: orderId,
          transactionReference,
        })
        .toPromise();

      if (result.error || result.data?.orderMarkAsPaid?.errors?.length) {
        throw new Error(
          result.error?.message ||
            result.data?.orderMarkAsPaid?.errors?.map((e: any) => e.message).join(', ')
        );
      }

      logger.info('Marked order as paid', { orderId, transactionReference });
    } catch (error: any) {
      logger.error('Error marking order as paid', error);
      // Non-critical, order still created
    }
  }

  /**
   * Add note to order
   */
  private async addOrderNote(orderId: string, message: string) {
    try {
      await this.client
        .mutation(OrderNoteAddDocument, {
          orderId,
          message,
        })
        .toPromise();

      logger.info('Added note to order', { orderId });
    } catch (error: any) {
      logger.error('Error adding order note', error);
      // Non-critical
    }
  }

  /**
   * Build address object for Saleor
   */
  private buildAddress(address?: ShiprocketOrderWebhook['shipping_address']) {
    if (!address) {
      return {
        firstName: 'Guest',
        lastName: 'Customer',
        streetAddress1: 'Address not provided',
        city: 'Unknown',
        postalCode: '000000',
        country: 'IN',
      };
    }

    // Extract first and last name if full name is provided
    const nameParts = address.city?.split(' ') || ['Guest', 'Customer'];
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    return {
      firstName,
      lastName,
      streetAddress1: address.address_line_1 || 'Not provided',
      streetAddress2: address.address_line_2 || '',
      city: address.city || 'Unknown',
      countryArea: address.state || '',
      postalCode: address.pincode || '000000',
      country: address.country || 'IN',
    };
  }
}
