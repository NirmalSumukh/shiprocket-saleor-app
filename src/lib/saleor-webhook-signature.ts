import crypto from 'crypto';

/**
 * Verify Saleor webhook signature
 * Saleor signs webhook payloads with HMAC-SHA256 using the app's SECRET_KEY
 * 
 * @param payload - Request body (string or object)
 * @param signature - Signature from 'saleor-signature' header
 * @returns true if signature is valid, false otherwise
 */
export function verifyWebhookSignature(payload: any, signature?: string): boolean {
  // No signature provided
  if (!signature) {
    return false;
  }

  // Check SECRET_KEY is configured
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error('SECRET_KEY not configured for webhook verification');
  }

  try {
    // Convert payload to string if needed
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    
    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payloadString)
      .digest('hex');

    // Convert to Uint8Array for timing-safe comparison
    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    // Check lengths match (timingSafeEqual requires equal lengths)
    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    // Perform timing-safe comparison
    return crypto.timingSafeEqual(
      new Uint8Array(signatureBuffer),
      new Uint8Array(expectedBuffer)
    );
  } catch (error) {
    // Log error in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Webhook signature verification error:', error);
    }
    return false;
  }
}

/**
 * Verify Saleor webhook signature for API routes
 * Wrapper that handles Next.js request headers
 * 
 * @param body - Request body
 * @param headers - Request headers
 * @returns true if signature is valid
 */
export function verifySaleorWebhook(body: any, headers: Record<string, string | string[] | undefined>): boolean {
  const signature = Array.isArray(headers['saleor-signature'])
    ? headers['saleor-signature'][0]
    : headers['saleor-signature'];

  return verifyWebhookSignature(body, signature);
}
