import crypto from 'crypto';
import { shiprocketConfig } from './config';

/**
 * Generate HMAC-SHA256 signature for ShipRocket API requests
 * @param payload - Request body as JSON string or object
 * @returns Base64 encoded HMAC signature
 */
export function generateHMAC(payload: string | object): string {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  
  const hmac = crypto
    .createHmac('sha256', shiprocketConfig.secretKey)
    .update(data)
    .digest('base64');
  
  return hmac;
}

/**
 * Verify incoming webhook HMAC signature
 * @param payload - Request body
 * @param receivedHmac - HMAC from X-Api-HMAC-SHA256 header
 * @returns true if signature is valid
 */
export function verifyHMAC(payload: string | object, receivedHmac: string): boolean {
  const expectedHmac = generateHMAC(payload);
  return crypto.timingSafeEqual(
    Buffer.from(expectedHmac),
    Buffer.from(receivedHmac)
  );
}

/**
 * Generate authenticated headers for ShipRocket API calls
 * @param payload - Request body
 */
export function getShiprocketHeaders(payload: object | string): Record<string, string> {
  return {
    'X-Api-Key': shiprocketConfig.apiKey,
    'X-Api-HMAC-SHA256': generateHMAC(payload),
    'Content-Type': 'application/json',
  };
}
