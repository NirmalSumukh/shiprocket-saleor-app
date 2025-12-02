import { shiprocketConfig } from './config';
import { getShiprocketHeaders } from './hmac';

/**
 * Generic ShipRocket API client
 */
export class ShiprocketClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = shiprocketConfig.baseUrl;
  }

  /**
   * Make authenticated POST request to ShipRocket
   */
  async post<TResponse = any>(
    endpoint: string,
    payload: object
  ): Promise<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = getShiprocketHeaders(payload);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `ShipRocket API error (${response.status}): ${errorText}`
      );
    }

    return response.json();
  }

  /**
   * Generate checkout access token
   */
  async generateAccessToken(cartData: {
    items: Array<{ variant_id: string; quantity: number }>;
    redirect_url?: string;
  }) {
    const payload = {
      cart_data: cartData,
      redirect_url: cartData.redirect_url || process.env.STOREFRONT_URL,
      timestamp: new Date().toISOString(),
    };

    return this.post<{
      result: {
        token: string;
        order_id: string;
      };
    }>(shiprocketConfig.endpoints.accessToken, payload);
  }

  /**
   * Sync product to ShipRocket
   */
  async syncProduct(productData: ShiprocketProductPayload) {
    return this.post(shiprocketConfig.endpoints.productWebhook, productData);
  }

  /**
   * Sync collection to ShipRocket
   */
  async syncCollection(collectionData: ShiprocketCollectionPayload) {
    return this.post(shiprocketConfig.endpoints.collectionWebhook, collectionData);
  }

  /**
   * Fetch order details from ShipRocket
   */
  async getOrderDetails(orderId: string) {
    const payload = {
      order_id: orderId,
      timestamp: new Date().toISOString(),
    };

    return this.post(shiprocketConfig.endpoints.orderDetails, payload);
  }
}

/**
 * ShipRocket Product Payload (as per their schema)
 */
export interface ShiprocketProductPayload {
  id: string;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  updated_at: string;
  status: 'active' | 'draft' | 'archived';
  variants: Array<{
    id: string;
    title: string;
    price: string;
    quantity: number;
    sku: string;
    updated_at: string;
    image: { src: string };
    weight: number;
  }>;
  image: { src: string };
}

/**
 * ShipRocket Collection Payload
 */
export interface ShiprocketCollectionPayload {
  id: string;
  updated_at: string;
  title: string;
  body_html: string;
  image: { src: string };
}

// Singleton instance
export const shiprocketClient = new ShiprocketClient();
