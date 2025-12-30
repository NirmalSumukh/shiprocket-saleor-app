import { NextApiRequest, NextApiResponse } from 'next';
import { createClientWithToken } from '@/lib/saleor/create-client';
import { OrderService } from '@/lib/shiprocket/order-service';
import { ShiprocketOrderWebhook } from '@/lib/shiprocket/types';
import { verifyHMAC } from '@/lib/shiprocket/hmac';
import { logger } from '@/lib/shiprocket/logger';

/**
 * POST /api/shiprocket/webhooks/order-placed
 * 
 * ShipRocket calls this webhook after successful checkout
 * Creates corresponding order in Saleor
 * 
 * Headers:
 * - x-api-hmac-sha256: HMAC signature for verification
 * 
 * Body: ShiprocketOrderWebhook payload
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData: ShiprocketOrderWebhook = req.body;

    logger.info('Received order webhook from ShipRocket', {
      orderId: webhookData.order_id,
      status: webhookData.status,
      itemCount: webhookData.cart_data?.items?.length || 0,
    });

    // Step 1: Verify HMAC signature (security check)
    const receivedHmac = req.headers['x-api-hmac-sha256'] as string;
    
    if (receivedHmac && !verifyHMAC(req.body, receivedHmac)) {
      logger.warn('Invalid HMAC signature in webhook', {
        orderId: webhookData.order_id,
      });
      return res.status(401).json({
        success: false,
        error: 'Invalid signature',
      });
    }

    // Step 2: Validate webhook payload
    if (!webhookData.order_id || !webhookData.cart_data?.items) {
      logger.warn('Invalid webhook payload - missing required fields', {
        hasOrderId: !!webhookData.order_id,
        hasCartData: !!webhookData.cart_data,
        hasItems: !!webhookData.cart_data?.items,
      });
      return res.status(400).json({
        success: false,
        error: 'Invalid webhook payload',
      });
    }

    // Step 3: Get Saleor configuration
    const saleorApiUrl = process.env.SALEOR_API_URL;
    const saleorAppToken = process.env.SALEOR_APP_TOKEN;
    const channel = process.env.SALEOR_DEFAULT_CHANNEL || 'default-channel';

    if (!saleorApiUrl || !saleorAppToken) {
      logger.error('Missing Saleor configuration');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
      });
    }

    // Step 4: Create Saleor GraphQL client
    const client = createClientWithToken(saleorApiUrl, saleorAppToken);

    // Step 5: Process order creation
    const orderService = new OrderService(client);
    const result = await orderService.createOrderFromWebhook(webhookData, channel);

    if (!result.success) {
      logger.error('Failed to create order in Saleor', {
        shiprocketOrderId: webhookData.order_id,
        error: result.error,
      });

      // Return 200 to prevent ShipRocket from retrying
      // Log error for manual intervention
      return res.status(200).json({
        success: false,
        error: result.error,
        message: 'Order creation failed but webhook acknowledged',
      });
    }

    logger.info('Successfully processed order webhook', {
      shiprocketOrderId: webhookData.order_id,
      saleorOrderId: result.orderId,
      orderNumber: result.orderNumber,
    });

    return res.status(200).json({
      success: true,
      order_id: result.orderId,
      order_number: result.orderNumber,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    logger.error('Order webhook processing error', error);

    // Return 200 to prevent infinite retries from ShipRocket
    // The order will need manual intervention
    return res.status(200).json({
      success: false,
      error: 'Internal error',
      message: error.message,
    });
  }
}

/**
 * Next.js API config
 * Keep bodyParser enabled for JSON parsing
 * If HMAC verification requires raw body, set to false and handle manually
 */
export const config = {
  api: {
    bodyParser: true,
  },
};
