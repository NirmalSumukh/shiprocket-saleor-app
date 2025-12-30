import { Client, cacheExchange, fetchExchange } from 'urql';
import { saleorApp } from '@/saleor-app';

/**
 * Create Saleor client with explicit token
 * RECOMMENDED: Use this for API routes with env var tokens
 * 
 * @param saleorApiUrl - Full URL to Saleor GraphQL endpoint
 * @param token - Authentication token
 * @returns Authenticated urql Client
 */
export function createClientWithToken(saleorApiUrl: string, token: string): Client {
  return new Client({
    url: saleorApiUrl,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

/**
 * Create Saleor client for API routes
 * Automatically handles authentication using Saleor App SDK
 * 
 * @param domain - Saleor instance domain (e.g., 'my-store.saleor.cloud')
 * @returns Authenticated urql Client
 */
export async function createAppClient(domain: string): Promise<Client> {
  const authData = await saleorApp.apl.get(domain);
  
  if (!authData) {
    throw new Error(`No auth data found for domain: ${domain}`);
  }

  return createClientWithToken(authData.saleorApiUrl, authData.token);
}

/**
 * Create client with synchronous token function
 * For cases where token is retrieved synchronously
 * 
 * @param saleorApiUrl - Full URL to Saleor GraphQL endpoint  
 * @param getToken - Synchronous function to get token
 * @returns Authenticated urql Client
 */
export function createClientWithTokenGetter(
  saleorApiUrl: string,
  getToken: () => string
): Client {
  return new Client({
    url: saleorApiUrl,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => ({
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }),
  });
}
