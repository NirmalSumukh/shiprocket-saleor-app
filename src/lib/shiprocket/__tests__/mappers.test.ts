import { describe, it, expect } from 'vitest';
import { mapSaleorProductToShipRocket, mapSaleorCollectionToShipRocket } from '../mappers';

describe('Saleor to ShipRocket Mappers', () => {
  it('should map Saleor product to ShipRocket format', () => {
    const saleorProduct = {
      id: 'prod-123',
      name: 'Test Product',
      description: 'Test description',
      category: { name: 'Electronics' },
      thumbnail: { url: 'https://example.com/image.jpg' },
      updatedAt: '2024-01-01T00:00:00Z',
      variants: [
        {
          id: 'var-123',
          name: 'Red',
          sku: 'TEST-RED',
          quantityAvailable: 10,
          pricing: {
            price: {
              gross: {
                amount: 99.99,
              },
            },
          },
          weight: {
            value: 1.5,
            unit: 'KG',
          },
          media: [{ url: 'https://example.com/variant.jpg' }],
        },
      ],
    };

    const result = mapSaleorProductToShipRocket(saleorProduct);

    expect(result.id).toBe('prod-123');
    expect(result.title).toBe('Test Product');
    expect(result.product_type).toBe('Electronics');
    expect(result.variants).toHaveLength(1);
    expect(result.variants[0].price).toBe('99.99');
    expect(result.variants[0].sku).toBe('TEST-RED');
  });

  it('should map Saleor collection to ShipRocket format', () => {
    const saleorCollection = {
      id: 'col-123',
      name: 'Test Collection',
      description: 'Test collection description',
      backgroundImage: { url: 'https://example.com/collection.jpg' },
    };

    const result = mapSaleorCollectionToShipRocket(saleorCollection);

    expect(result.id).toBe('col-123');
    expect(result.title).toBe('Test Collection');
    expect(result.body_html).toBe('Test collection description');
    expect(result.image?.src).toBe('https://example.com/collection.jpg');
  });
});
