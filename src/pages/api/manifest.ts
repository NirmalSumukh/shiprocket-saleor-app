import { createManifestHandler } from '@saleor/app-sdk/handlers/next';
import { AppManifest } from '@saleor/app-sdk/types';

/**
 * App manifest - tells Saleor about your app and its capabilities
 */
export default createManifestHandler({
  async manifestFactory({ appBaseUrl, request }) {
    // Use environment variable or fallback to request URL
    const baseUrl = process.env.APP_API_BASE_URL || appBaseUrl;
    
    console.log('[Manifest] Generating manifest for:', baseUrl);

    const manifest: AppManifest = {
      id: 'saleor.app.shiprocket',
      version: '1.0.0',
      name: 'ShipRocket Checkout Integration',
      
      about: 'Integrate ShipRocket Checkout for seamless order processing with Indian D2C brands',
      
      // Where Saleor sends the install/auth token
      tokenTargetUrl: `${baseUrl}/api/register`,
      
      // Main app URL
      appUrl: baseUrl,
      
      // Required permissions
      permissions: [
        'MANAGE_PRODUCTS',
        'MANAGE_ORDERS',
        'MANAGE_CHECKOUTS',
      ],
      
      // Webhooks (these will auto-register when app is installed)
      webhooks: [
        {
          name: 'Product Updated - Sync to ShipRocket',
          asyncEvents: ['PRODUCT_UPDATED'],
          query: `
            subscription {
              event {
                ... on ProductUpdated {
                  product {
                    id
                    name
                    description
                    slug
                    updatedAt
                    category { name }
                    thumbnail { url }
                    variants {
                      id
                      name
                      sku
                      quantityAvailable
                      pricing {
                        price {
                          gross {
                            amount
                            currency
                          }
                        }
                      }
                      weight { value unit }
                      media { url }
                    }
                    metadata { key value }
                  }
                }
              }
            }
          `,
          targetUrl: `${baseUrl}/api/webhooks/saleor-product-updated`,
          isActive: true,
        },
        {
          name: 'Product Variant Updated - Sync to ShipRocket',
          asyncEvents: ['PRODUCT_VARIANT_UPDATED'],
          query: `
            subscription {
              event {
                ... on ProductVariantUpdated {
                  productVariant {
                    id
                    name
                    sku
                    product {
                      id
                      name
                      description
                      updatedAt
                      category { name }
                      thumbnail { url }
                      variants {
                        id
                        name
                        sku
                        quantityAvailable
                        pricing {
                          price {
                            gross { amount currency }
                          }
                        }
                        weight { value unit }
                        media { url }
                      }
                    }
                  }
                }
              }
            }
          `,
          targetUrl: `${baseUrl}/api/webhooks/saleor-product-variant-updated`,
          isActive: true,
        },
        {
          name: 'Collection Updated - Sync to ShipRocket',
          asyncEvents: ['COLLECTION_UPDATED'],
          query: `
            subscription {
              event {
                ... on CollectionUpdated {
                  collection {
                    id
                    name
                    description
                    slug
                    backgroundImage { url }
                  }
                }
              }
            }
          `,
          targetUrl: `${baseUrl}/api/webhooks/saleor-collection-updated`,
          isActive: true,
        },
      ],
      
      extensions: [],
    };

    return manifest;
  },
});
