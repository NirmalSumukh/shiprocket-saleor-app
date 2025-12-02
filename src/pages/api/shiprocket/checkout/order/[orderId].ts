import { NextApiRequest, NextApiResponse } from 'next';
import { checkoutService } from '@/lib/shiprocket/checkout-service';
import { logger } from '@/lib/shiprocket/logger';

/**
 * GET /api/shiprocket/checkout/order/[orderId]
 * 
 * Fetch order details from ShipRocket after checkout completion
 * Used for verification or displaying order info to customer
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.query;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    logger.info('Fetching order details', { orderId });

    const orderDetails = await checkoutService.fetchOrderDetails(orderId);

    return res.status(200).json({
      success: true,
      order: orderDetails,
    });
  } catch (error: any) {
    logger.error('Fetch order details API error', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch order details',
      message: error.message,
    });
  }
}
