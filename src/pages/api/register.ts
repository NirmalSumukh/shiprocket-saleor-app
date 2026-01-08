import { createAppRegisterHandler } from '@saleor/app-sdk/handlers/next';
import { saleorApp } from '@/saleor-app';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Normalize Saleor API URL to use HTTPS for production domains
 * Some reverse proxy configurations may cause Saleor to send http:// instead of https://
 */
function normalizeSaleorUrl(url: string): string {
  const productionDomains = [
    'saleor.leemasmart.com',
    'leemasmart.com',
  ];

  try {
    const parsed = new URL(url);
    if (productionDomains.some(domain => parsed.hostname.includes(domain))) {
      parsed.protocol = 'https:';
      console.log('[Register] Normalized URL to HTTPS:', parsed.toString());
      return parsed.toString();
    }
  } catch (e) {
    // Return original if parsing fails
  }

  return url;
}

/**
 * Required endpoint for app installation
 * Saleor sends auth token here during installation
 */
const baseHandler = createAppRegisterHandler({
  apl: saleorApp.apl,
  /**
   * Allow Saleor URLs for app registration
   * The parameter is a string URL, not a URL object
   */
  allowedSaleorUrls: [
    (saleorApiUrl: string) => {
      // Normalize to HTTPS before checking
      const normalizedUrl = normalizeSaleorUrl(saleorApiUrl);
      console.log('[Register] Checking Saleor URL:', saleorApiUrl, '-> Normalized:', normalizedUrl);

      // In development, allow everything
      if (process.env.NODE_ENV === 'development') {
        console.log('[Register] Development mode - allowing:', normalizedUrl);
        return true;
      }

      // In production, check against allowed hosts
      try {
        const url = new URL(normalizedUrl);
        const allowedHosts = [
          'saleor.leemasmart.com',
          'leemasmart.com',
          'localhost',
        ];

        // Also check if SALEOR_API_URL env matches
        const envSaleorUrl = process.env.SALEOR_API_URL;
        if (envSaleorUrl) {
          try {
            const envUrl = new URL(envSaleorUrl);
            if (!allowedHosts.includes(envUrl.hostname)) {
              allowedHosts.push(envUrl.hostname);
            }
          } catch (e) {
            // Ignore invalid env URL
          }
        }

        const isAllowed = allowedHosts.includes(url.hostname);
        console.log('[Register] URL hostname:', url.hostname, 'Allowed:', isAllowed);
        return isAllowed;
      } catch (error) {
        console.error('[Register] Invalid URL:', normalizedUrl, error);
        return false;
      }
    },
  ],
});

/**
 * Wrapper handler that normalizes the saleor-api-url header to HTTPS
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Normalize the saleor-api-url header if present
  const saleorApiUrl = req.headers['saleor-api-url'];
  if (typeof saleorApiUrl === 'string') {
    const normalizedUrl = normalizeSaleorUrl(saleorApiUrl);
    if (normalizedUrl !== saleorApiUrl) {
      console.log('[Register] Rewriting saleor-api-url header from', saleorApiUrl, 'to', normalizedUrl);
      req.headers['saleor-api-url'] = normalizedUrl;
    }
  }

  return baseHandler(req, res);
}

