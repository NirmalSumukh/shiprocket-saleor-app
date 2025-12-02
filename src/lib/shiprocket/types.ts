/**
 * ShipRocket Order Webhook Payload
 */
export interface ShiprocketOrderWebhook {
  order_id: string;
  cart_data: {
    items: Array<{
      variant_id: string;
      quantity: number;
    }>;
  };
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  phone: string;
  email: string;
  payment_type: 'CASH_ON_DELIVERY' | 'PREPAID';
  total_amount_payable: number;
  
  // Additional fields from full payload
  customer_details?: {
    name: string;
    phone: string;
    email: string;
  };
  shipping_address?: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  billing_address?: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

/**
 * Catalog API Response Format (for Shiprocket to consume)
 */
export interface CatalogProductsResponse {
  products: Array<{
    id: string;
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    created_at: string;
    updated_at: string;
    status: string;
    variants: Array<{
      id: string;
      product_id: string;
      title: string;
      price: string;
      sku: string;
      compare_at_price: string;
      inventory_quantity: number;
      weight: number;
      weight_unit: string;
      image: { src: string } | null;
      updated_at: string;
    }>;
    image: { src: string } | null;
  }>;
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface CatalogCollectionsResponse {
  collections: Array<{
    id: string;
    title: string;
    body_html: string;
    updated_at: string;
    image: { src: string } | null;
  }>;
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface ShiprocketOrderWebhook {
  order_id: string;
  cart_data: {
    items: Array<{
      variant_id: string;
      quantity: number;
      product_id?: string;
      price?: number;
    }>;
  };
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  phone: string;
  email: string;
  payment_type: 'CASH_ON_DELIVERY' | 'PREPAID';
  total_amount_payable: number;
  
  customer_details?: {
    name: string;
    phone: string;
    email: string;
  };
  
  shipping_address?: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  
  billing_address?: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  
  // Additional metadata
  coupon_code?: string;
  discount_amount?: number;
  shipping_charges?: number;
  payment_method?: string;
  transaction_id?: string;
}