/**
 * Cart item from frontend
 */
export interface CheckoutCartItem {
  variant_id: string;
  quantity: number;
}

/**
 * Checkout request payload from frontend
 */
export interface CheckoutRequest {
  cart_data: {
    items: CheckoutCartItem[];
  };
  redirect_url?: string;
  customer_email?: string;
  customer_phone?: string;
}

/**
 * ShipRocket Access Token Response
 */
export interface ShipRocketAccessTokenResponse {
  status: boolean;
  message: string;
  result: {
    token: string;
    order_id: string;
    checkout_url?: string;
  };
}

/**
 * Our API response to frontend
 */
export interface CheckoutAuthorizationResponse {
  success: boolean;
  token: string;
  order_id: string;
  checkout_url?: string;
  error?: string;
}

/**
 * Validate cart data before sending to ShipRocket
 */
export function validateCartData(cartData: CheckoutRequest['cart_data']): {
  valid: boolean;
  error?: string;
} {
  if (!cartData || !cartData.items || !Array.isArray(cartData.items)) {
    return { valid: false, error: 'Invalid cart data: items array is required' };
  }

  if (cartData.items.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }

  for (const item of cartData.items) {
    if (!item.variant_id || typeof item.variant_id !== 'string') {
      return { valid: false, error: 'Invalid variant_id in cart item' };
    }

    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
      return { valid: false, error: 'Invalid quantity in cart item' };
    }
  }

  return { valid: true };
}
