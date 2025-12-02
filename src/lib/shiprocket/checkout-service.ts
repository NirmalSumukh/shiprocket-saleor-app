import { shiprocketClient } from './client';
import { validateCartData, CheckoutRequest, CheckoutAuthorizationResponse } from './checkout-types';
import { logger } from './logger';

export class CheckoutService {
  /**
   * Generate ShipRocket access token for checkout
   */
  async generateCheckoutToken(
    request: CheckoutRequest
  ): Promise<CheckoutAuthorizationResponse> {
    try {
      // Validate cart data
      const validation = validateCartData(request.cart_data);
      if (!validation.valid) {
        logger.warn('Cart validation failed', validation.error);
        return {
          success: false,
          token: '',
          order_id: '',
          error: validation.error,
        };
      }

      // Set default redirect URL if not provided
      const redirectUrl = request.redirect_url || process.env.STOREFRONT_URL || '';

      logger.info('Generating ShipRocket checkout token', {
        itemCount: request.cart_data.items.length,
        redirectUrl,
      });

      // Call ShipRocket API
      const response = await shiprocketClient.generateAccessToken({
        items: request.cart_data.items,
        redirect_url: redirectUrl,
      });

      if (!response.result?.token) {
        throw new Error('ShipRocket did not return a valid token');
      }

      logger.info('Successfully generated checkout token', {
        order_id: response.result.order_id,
      });

      return {
        success: true,
        token: response.result.token,
        order_id: response.result.order_id,
        checkout_url: response.result.checkout_url,
      };
    } catch (error: any) {
      logger.error('Failed to generate checkout token', error);
      return {
        success: false,
        token: '',
        order_id: '',
        error: error.message || 'Failed to generate checkout token',
      };
    }
  }

  /**
   * Fetch order details from ShipRocket after checkout
   */
  async fetchOrderDetails(orderId: string) {
    try {
      logger.info('Fetching order details from ShipRocket', { orderId });
      
      const response = await shiprocketClient.getOrderDetails(orderId);
      
      logger.info('Successfully fetched order details', { orderId });
      return response;
    } catch (error: any) {
      logger.error('Failed to fetch order details', error);
      throw error;
    }
  }
}

// Singleton instance
export const checkoutService = new CheckoutService();
