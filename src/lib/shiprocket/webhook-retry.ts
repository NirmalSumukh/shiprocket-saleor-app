import { ShiprocketOrderWebhook } from './types';
import { logger } from './logger';

interface FailedWebhook {
  webhook: ShiprocketOrderWebhook;
  timestamp: Date;
  attempts: number;
  lastError: string;
}

/**
 * Simple in-memory queue for failed webhooks
 * In production, use a proper queue system like Bull, SQS, or RabbitMQ
 */
class WebhookRetryQueue {
  private queue: Map<string, FailedWebhook> = new Map();
  private maxAttempts = 3;

  /**
   * Add failed webhook to retry queue
   */
  addToQueue(webhook: ShiprocketOrderWebhook, error: string) {
    const existing = this.queue.get(webhook.order_id);

    if (existing) {
      existing.attempts += 1;
      existing.lastError = error;
      existing.timestamp = new Date();
    } else {
      this.queue.set(webhook.order_id, {
        webhook,
        timestamp: new Date(),
        attempts: 1,
        lastError: error,
      });
    }

    logger.warn('Added webhook to retry queue', {
      orderId: webhook.order_id,
      attempts: existing ? existing.attempts : 1,
    });
  }

  /**
   * Get all webhooks ready for retry
   */
  getRetryableWebhooks(): FailedWebhook[] {
    const retryable: FailedWebhook[] = [];
    const now = Date.now();

    for (const [orderId, failed] of this.queue.entries()) {
      // Retry after 5 minutes
      const timeSinceLastAttempt = now - failed.timestamp.getTime();
      
      if (timeSinceLastAttempt > 5 * 60 * 1000 && failed.attempts < this.maxAttempts) {
        retryable.push(failed);
      } else if (failed.attempts >= this.maxAttempts) {
        // Remove from queue after max attempts
        this.queue.delete(orderId);
        logger.error('Max retry attempts reached for webhook', {
          orderId,
          attempts: failed.attempts,
          lastError: failed.lastError,
        });
      }
    }

    return retryable;
  }

  /**
   * Remove successfully processed webhook
   */
  removeFromQueue(orderId: string) {
    this.queue.delete(orderId);
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      queueSize: this.queue.size,
      items: Array.from(this.queue.values()).map((item) => ({
        orderId: item.webhook.order_id,
        attempts: item.attempts,
        lastError: item.lastError,
        timestamp: item.timestamp,
      })),
    };
  }
}

export const webhookRetryQueue = new WebhookRetryQueue();
