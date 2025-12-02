import { Client } from 'urql';
import {
  FetchProductsForShipRocketDocument,
  FetchCollectionsForShipRocketDocument,
  FetchProductsByCollectionDocument,
} from '../../../generated/graphql';
import { buildProductsResponse, buildCollectionsResponse } from './mappers';
import { logger } from './logger';

export class CatalogService {
  constructor(private client: Client) {}

  /**
   * Fetch all products with cursor-based pagination
   */
  async fetchProducts(page: number = 1, limit: number = 100, channel: string = 'default-channel') {
    try {
      // Calculate how many items to skip based on page number
      const itemsToFetch = page * limit;
      
      let allProducts: any[] = [];
      let hasNextPage = true;
      let cursor: string | null = null;
      let totalCount = 0;

      // Fetch pages until we have enough products for the requested page
      while (hasNextPage && allProducts.length < itemsToFetch) {
        const result = await this.client
          .query(FetchProductsForShipRocketDocument, {
            first: limit,
            after: cursor,
            channel,
          })
          .toPromise();

        if (result.error) {
          throw new Error(`Saleor GraphQL error: ${result.error.message}`);
        }

        const products = result.data?.products?.edges?.map((edge: any) => edge.node) || [];
        totalCount = result.data?.products?.totalCount || 0;
        hasNextPage = result.data?.products?.pageInfo?.hasNextPage || false;
        cursor = result.data?.products?.pageInfo?.endCursor || null;

        allProducts = allProducts.concat(products);
      }

      // Slice to get only the products for the requested page
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const pageProducts = allProducts.slice(startIndex, endIndex);

      logger.info(`Fetched ${pageProducts.length} products for page ${page}`);

      return buildProductsResponse(pageProducts, page, limit, totalCount);
    } catch (error) {
      logger.error('Error fetching products', error);
      throw error;
    }
  }

  /**
   * Fetch all collections with cursor-based pagination
   */
  async fetchCollections(page: number = 1, limit: number = 100, channel: string = 'default-channel') {
    try {
      const itemsToFetch = page * limit;
      
      let allCollections: any[] = [];
      let hasNextPage = true;
      let cursor: string | null = null;
      let totalCount = 0;

      while (hasNextPage && allCollections.length < itemsToFetch) {
        const result = await this.client
          .query(FetchCollectionsForShipRocketDocument, {
            first: limit,
            after: cursor,
            channel,
          })
          .toPromise();

        if (result.error) {
          throw new Error(`Saleor GraphQL error: ${result.error.message}`);
        }

        const collections = result.data?.collections?.edges?.map((edge: any) => edge.node) || [];
        totalCount = result.data?.collections?.totalCount || 0;
        hasNextPage = result.data?.collections?.pageInfo?.hasNextPage || false;
        cursor = result.data?.collections?.pageInfo?.endCursor || null;

        allCollections = allCollections.concat(collections);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const pageCollections = allCollections.slice(startIndex, endIndex);

      logger.info(`Fetched ${pageCollections.length} collections for page ${page}`);

      return buildCollectionsResponse(pageCollections, page, limit, totalCount);
    } catch (error) {
      logger.error('Error fetching collections', error);
      throw error;
    }
  }

  /**
   * Fetch products by collection ID
   */
  async fetchProductsByCollection(
    collectionId: string,
    page: number = 1,
    limit: number = 100,
    channel: string = 'default-channel'
  ) {
    try {
      const itemsToFetch = page * limit;
      
      let allProducts: any[] = [];
      let hasNextPage = true;
      let cursor: string | null = null;
      let totalCount = 0;

      while (hasNextPage && allProducts.length < itemsToFetch) {
        const result = await this.client
          .query(FetchProductsByCollectionDocument, {
            collectionId,
            first: limit,
            after: cursor,
            channel,
          })
          .toPromise();

        if (result.error) {
          throw new Error(`Saleor GraphQL error: ${result.error.message}`);
        }

        const products = result.data?.collection?.products?.edges?.map((edge: any) => edge.node) || [];
        totalCount = result.data?.collection?.products?.totalCount || 0;
        hasNextPage = result.data?.collection?.products?.pageInfo?.hasNextPage || false;
        cursor = result.data?.collection?.products?.pageInfo?.endCursor || null;

        allProducts = allProducts.concat(products);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const pageProducts = allProducts.slice(startIndex, endIndex);

      logger.info(`Fetched ${pageProducts.length} products for collection ${collectionId}, page ${page}`);

      return buildProductsResponse(pageProducts, page, limit, totalCount);
    } catch (error) {
      logger.error(`Error fetching products for collection ${collectionId}`, error);
      throw error;
    }
  }
}
