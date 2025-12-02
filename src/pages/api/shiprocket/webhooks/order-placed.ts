import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/saleor-app-checkout/backend/saleor';
import { OrderService } from '@/lib/shiprocket/order-service';
import { ShiprocketOrderWebhook } from '@/lib/shiprocket/types';
import { verifyHMAC } from '@/lib/shiprocket/hmac';
import { logger } from '@/lib/shiprocket/logger';

/**
 * POST /api/shiprocket/webhooks/order-placed
 * 
 * ShipRocket calls this webhook after successful checkout
 * Creates order in Saleor
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
      logger.warn('Invalid webhook payload', webhookData);
      return res.status(400).json({
        success: false,
        error: 'Invalid webhook payload',
      });
    }

    // Step 3: Create Saleor GraphQL client
    const saleorApiUrl = process.env.SALEOR_API_URL || '';
    const client = createClient(saleorApiUrl, async () => ({
      token: process.env.SALEOR_APP_TOKEN || '',
    }));

    // Step 4: Process order creation
    const orderService = new OrderService(client);
    const result = await orderService.createOrderFromWebhook(webhookData);

    if (!result.success) {
      logger.error('Failed to create order', {
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
    return res.status(200).json({
      success: false,
      error: 'Internal error',
      message: error.message,
    });
  }
}

/**
 * Disable Next.js body parsing to get raw body for HMAC verification
 */
export const config = {
  api: {
    bodyParser: true, // Set to false if you need raw body for HMAC
  },
};
