import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from './logger';

/**
 * Simple in-memory rate limiter for checkout endpoints
 * For production, use Redis or a proper rate limiting service
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 10, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is within rate limit
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Filter out requests outside the time window
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (recentRequests.length >= this.limit) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    return true;
  }

  /**
   * Clean up expired entries
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(
        (timestamp) => now - timestamp < this.windowMs
      );
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }

  /**
   * Get identifier from request (IP address)
   */
  getIdentifier(req: NextApiRequest): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const identifier = rateLimiter.getIdentifier(req);

    if (!rateLimiter.isAllowed(identifier)) {
      logger.warn('Rate limit exceeded', { identifier });
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please try again later',
      });
    }

    return handler(req, res);
  };
}
