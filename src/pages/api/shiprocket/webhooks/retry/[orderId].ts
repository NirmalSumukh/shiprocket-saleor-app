import { NextApiRequest, NextApiResponse } from 'next';
import { createClientWithToken } from '@/lib/saleor/create-client';
import { OrderService } from '@/lib/shiprocket/order-service';
import { ShiprocketOrderWebhook } from '@/lib/shiprocket/types';
import { webhookRetryQueue } from '@/lib/shiprocket/webhook-retry';
import { logger } from '@/lib/shiprocket/logger';

/**
 * POST /api/shiprocket/webhooks/retry/[orderId]
 * 
 * Manually retry a failed webhook for order creation
 * For admin use only - requires SECRET_KEY authentication
 * 
 * Route params: orderId (ShipRocket order ID)
 * Body: ShiprocketOrderWebhook payload
 * 
 * Headers:
 * - Authorization: Bearer {SECRET_KEY}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authentication - require SECRET_KEY
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.SECRET_KEY}`) {
    logger.warn('Unauthorized retry attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Extract order ID from route params
    const { orderId } = req.query;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    logger.info('Manual retry requested for order', { orderId });

    // Get webhook data from request body
    const webhookData: ShiprocketOrderWebhook = req.body;

    if (!webhookData || !webhookData.cart_data || !webhookData.order_id) {
      return res.status(400).json({
        error: 'Valid webhook data is required in request body',
        required: ['order_id', 'cart_data', 'status', 'email', 'phone'],
      });
    }

    // Validate order ID matches
    if (webhookData.order_id !== orderId) {
      return res.status(400).json({
        error: 'Order ID in URL does not match order ID in webhook data',
      });
    }

    // Get Saleor configuration
    const saleorApiUrl = process.env.SALEOR_API_URL;
    const saleorAppToken = process.env.SALEOR_APP_TOKEN;
    const channel = process.env.SALEOR_DEFAULT_CHANNEL || 'default-channel';

    if (!saleorApiUrl || !saleorAppToken) {
      logger.error('Missing Saleor configuration');
      return res.status(500).json({
        error: 'Server configuration error',
      });
    }

    // Create Saleor client
    const client = createClientWithToken(saleorApiUrl, saleorAppToken);

    // Retry order creation
    const orderService = new OrderService(client);
    const result = await orderService.createOrderFromWebhook(webhookData, channel);

    if (result.success) {
      // Remove from retry queue on success
      webhookRetryQueue.removeFromQueue(orderId);

      logger.info('Order created successfully on manual retry', {
        shiprocketOrderId: orderId,
        saleorOrderId: result.orderId,
        orderNumber: result.orderNumber,
      });

      return res.status(200).json({
        success: true,
        message: 'Order created successfully on retry',
        order_id: result.orderId,
        order_number: result.orderNumber,
      });
    } else {
      logger.warn('Manual retry failed', {
        shiprocketOrderId: orderId,
        error: result.error,
      });

      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error: any) {
    logger.error('Manual retry processing error', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
