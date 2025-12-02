import { NextApiRequest, NextApiResponse } from 'next';
import { checkoutService } from '@/lib/shiprocket/checkout-service';
import { CheckoutRequest } from '@/lib/shiprocket/checkout-types';
import { logger } from '@/lib/shiprocket/logger';
import { withRateLimit } from '@/lib/shiprocket/rate-limiter';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request: CheckoutRequest = req.body;

    // Basic request validation
    if (!request.cart_data) {
      return res.status(400).json({
        success: false,
        error: 'Missing cart_data in request body',
      });
    }

    // Log request metadata for debugging
    logger.info('Received checkout authorization request', {
      itemCount: request.cart_data.items?.length || 0,
      hasRedirectUrl: !!request.redirect_url,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    // Generate token via service
    const result = await checkoutService.generateCheckoutToken(request);

    // Return appropriate status code
    const statusCode = result.success ? 200 : 400;

    return res.status(statusCode).json(result);
  } catch (error: any) {
    logger.error('Checkout authorization API error', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

// Export with rate limiting middleware
export default withRateLimit(handler);
