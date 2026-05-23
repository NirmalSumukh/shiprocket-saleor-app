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

    // Enhanced logging for debugging
    console.log('[ShipRocket API] Request Details:', {
      url,
      endpoint,
      hasApiKey: !!headers['X-Api-Key'],
      hasHmac: !!headers['X-Api-HMAC-SHA256'],
      payloadStructure: JSON.stringify(payload, null, 2),
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    console.log('[ShipRocket API] Response:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ShipRocket API] Error Response:', errorText);
      throw new Error(
        `ShipRocket API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    console.log('[ShipRocket API] Success Response:', JSON.stringify(data, null, 2));
    return data;
  }

  /**
   * Generate checkout access token
   * Returns token and checkout URL for ShipRocket widget
   */
  async generateAccessToken(cartData: {
    items: Array<{ variant_id: string; quantity: number }>;
    redirect_url?: string;
  }) {
    // ShipRocket expects cart_data wrapper with items inside
    const payload = {
      cart_data: {
        items: cartData.items,
      },
      redirect_url: cartData.redirect_url || process.env.STOREFRONT_URL,
      timestamp: new Date().toISOString(),
    };

    return this.post<{
      status?: boolean;
      message?: string;
      result: {
        token: string;
        order_id: string;
        checkout_url?: string; // ✅ Added this property
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

    return this.post<{
      status?: boolean;
      message?: string;
      result?: any; // ShipRocket order details
    }>(shiprocketConfig.endpoints.orderDetails, payload);
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
