import crypto from 'crypto';

/**
 * Verify Saleor webhook signature
 * @param payload - Request body
 * @param signature - Signature from 'saleor-signature' header
 */
export function verifyWebhookSignature(payload: any, signature?: string): boolean {
  if (!signature) {
    return false;
  }

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error('SECRET_KEY not configured');
  }

  try {
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payloadString)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    return false;
  }
}
