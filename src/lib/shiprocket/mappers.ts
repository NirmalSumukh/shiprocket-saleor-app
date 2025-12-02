import { CatalogProductsResponse, CatalogCollectionsResponse } from './types';

/**
 * Map Saleor Product to ShipRocket format
 */
export function mapSaleorProductToShipRocket(saleorProduct: any): any {
  const firstVariant = saleorProduct.variants?.[0];
  const thumbnailUrl = saleorProduct.thumbnail?.url || firstVariant?.media?.[0]?.url || '';

  return {
    id: saleorProduct.id,
    title: saleorProduct.name || '',
    body_html: saleorProduct.description || '',
    vendor: saleorProduct.metadata?.find((m: any) => m.key === 'vendor')?.value || 'Default Vendor',
    product_type: saleorProduct.category?.name || 'Uncategorized',
    created_at: saleorProduct.created || new Date().toISOString(),
    updated_at: saleorProduct.updatedAt || new Date().toISOString(),
    status: 'active', // Saleor doesn't have draft status in the same way
    variants: (saleorProduct.variants || []).map((variant: any) => ({
      id: variant.id,
      product_id: saleorProduct.id,
      title: variant.name || 'Default',
      price: variant.pricing?.price?.gross?.amount?.toString() || '0',
      sku: variant.sku || '',
      compare_at_price: '', // Add if you have compare at price in metadata
      inventory_quantity: variant.quantityAvailable || 0,
      weight: variant.weight?.value || 0,
      weight_unit: variant.weight?.unit?.toLowerCase() || 'kg',
      image: variant.media?.[0]?.url
        ? { src: variant.media[0].url }
        : thumbnailUrl
        ? { src: thumbnailUrl }
        : null,
      updated_at: saleorProduct.updatedAt || new Date().toISOString(),
    })),
    image: thumbnailUrl ? { src: thumbnailUrl } : null,
  };
}

/**
 * Map Saleor Collection to ShipRocket format
 */
export function mapSaleorCollectionToShipRocket(saleorCollection: any): any {
  return {
    id: saleorCollection.id,
    title: saleorCollection.name || '',
    body_html: saleorCollection.description || '',
    updated_at: new Date().toISOString(), // Saleor collections don't have updatedAt
    image: saleorCollection.backgroundImage?.url
      ? { src: saleorCollection.backgroundImage.url }
      : null,
  };
}

/**
 * Build paginated response for products
 */
export function buildProductsResponse(
  products: any[],
  page: number,
  perPage: number,
  totalCount: number
): CatalogProductsResponse {
  return {
    products: products.map(mapSaleorProductToShipRocket),
    pagination: {
      current_page: page,
      total_pages: Math.ceil(totalCount / perPage),
      total_count: totalCount,
      per_page: perPage,
    },
  };
}

/**
 * Build paginated response for collections
 */
export function buildCollectionsResponse(
  collections: any[],
  page: number,
  perPage: number,
  totalCount: number
): CatalogCollectionsResponse {
  return {
    collections: collections.map(mapSaleorCollectionToShipRocket),
    pagination: {
      current_page: page,
      total_pages: Math.ceil(totalCount / perPage),
      total_count: totalCount,
      per_page: perPage,
    },
  };
}
