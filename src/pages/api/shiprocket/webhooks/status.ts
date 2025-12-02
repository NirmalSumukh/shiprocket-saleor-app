import { NextApiRequest, NextApiResponse } from 'next';
import { webhookRetryQueue } from '@/lib/shiprocket/webhook-retry';

/**
 * GET /api/shiprocket/webhooks/status
 * 
 * Check status of webhook retry queue
 * For internal monitoring only - secure this endpoint in production
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Add authentication for this endpoint
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const status = webhookRetryQueue.getQueueStatus();

    return res.status(200).json({
      success: true,
      ...status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
