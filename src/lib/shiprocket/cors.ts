import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from './logger';

/**
 * CORS Configuration for ShipRocket API endpoints
 * Allows storefront to call checkout APIs from different origins
 */

/**
 * Get allowed origins from environment variable
 */
export function getAllowedOrigins(): string[] {
  const origins = process.env.ALLOWED_ORIGINS || '';
  return origins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;

  const allowedOrigins = getAllowedOrigins();

  // If no origins configured, block all
  if (allowedOrigins.length === 0) {
    logger.warn('No ALLOWED_ORIGINS configured. Blocking all CORS requests.');
    return false;
  }

  // Check if origin is in whitelist
  const isAllowed = allowedOrigins.includes(origin);

  if (!isAllowed) {
    logger.warn('Blocked CORS request from unauthorized origin', { origin });
  }

  return isAllowed;
}

/**
 * Set CORS headers on response
 */
export function setCorsHeaders(
  req: NextApiRequest,
  res: NextApiResponse,
  options: {
    allowedMethods?: string[];
    allowedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  } = {}
): boolean {
  const origin = req.headers.origin;

  // Check if origin is allowed
  if (!isOriginAllowed(origin)) {
    return false;
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin!);
  res.setHeader(
    'Access-Control-Allow-Methods',
    options.allowedMethods?.join(', ') || 'GET, POST, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    options.allowedHeaders?.join(', ') ||
      'Content-Type, Authorization, X-Requested-With'
  );

  if (options.credentials !== false) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (options.maxAge) {
    res.setHeader('Access-Control-Max-Age', options.maxAge.toString());
  }

  return true;
}

/**
 * Handle preflight OPTIONS request
 */
export function handleCorsPrelight(
  req: NextApiRequest,
  res: NextApiResponse,
  options: {
    allowedMethods?: string[];
    allowedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  } = {}
): boolean {
  if (req.method === 'OPTIONS') {
    const corsSet = setCorsHeaders(req, res, options);
    if (corsSet) {
      res.status(200).end();
      return true;
    } else {
      res.status(403).json({ error: 'Origin not allowed' });
      return true;
    }
  }
  return false;
}

/**
 * CORS middleware wrapper for API routes
 * Usage: export default withCors(handler);
 */
export function withCors(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: {
    allowedMethods?: string[];
    allowedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  } = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Handle preflight
    if (handleCorsPrelight(req, res, options)) {
      return;
    }

    // Set CORS headers for actual request
    const corsSet = setCorsHeaders(req, res, options);
    if (!corsSet) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }

    // Call the actual handler
    return handler(req, res);
  };
}

/**
 * Validate CORS configuration on app startup
 */
export function validateCorsConfig(): void {
  const allowedOrigins = getAllowedOrigins();

  if (allowedOrigins.length === 0) {
    logger.error(
      'CRITICAL: No ALLOWED_ORIGINS configured. All CORS requests will be blocked.'
    );
    throw new Error('ALLOWED_ORIGINS environment variable is required');
  }

  logger.info('CORS configuration validated', {
    allowedOrigins,
    count: allowedOrigins.length,
  });

  // Warn about localhost in production
  if (process.env.NODE_ENV === 'production') {
    const hasLocalhost = allowedOrigins.some((origin) =>
      origin.includes('localhost')
    );
    if (hasLocalhost) {
      logger.warn(
        'WARNING: localhost origin detected in production CORS configuration'
      );
    }
  }
}
