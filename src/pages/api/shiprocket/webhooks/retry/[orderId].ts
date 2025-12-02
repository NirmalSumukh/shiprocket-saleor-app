import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/saleor-app-checkout/backend/saleor';
import { OrderService } from '@/lib/shiprocket/order-service';
import { webhookRetryQueue } from '@/lib/shiprocket/webhook-retry';
import { logger } from '@/lib/shiprocket/logger';

/**
 * POST /api/shiprocket/webhooks/retry/[orderId]
 * 
 * Manually retry a failed webhook
 * For admin use only - secure this endpoint in production
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Add proper authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { orderId } = req.query;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    logger.info('Manual retry requested for order', { orderId });

    // Get webhook data from request body
    const webhookData = req.body;

    if (!webhookData || !webhookData.cart_data) {
      return res.status(400).json({
        error: 'Webhook data is required in request body',
      });
    }

    // Create Saleor client
    const saleorApiUrl = process.env.SALEOR_API_URL || '';
    const client = createClient(saleorApiUrl, async () => ({
      token: process.env.SALEOR_APP_TOKEN || '',
    }));

    // Retry order creation
    const orderService = new OrderService(client);
    const result = await orderService.createOrderFromWebhook(webhookData);

    if (result.success) {
      webhookRetryQueue.removeFromQueue(orderId);
      
      return res.status(200).json({
        success: true,
        message: 'Order created successfully on retry',
        order_id: result.orderId,
        order_number: result.orderNumber,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error: any) {
    logger.error('Manual retry failed', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
