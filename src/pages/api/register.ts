import { createAppRegisterHandler } from '@saleor/app-sdk/handlers/next';
import { saleorApp } from '@/saleor-app';

/**
 * Required endpoint for app installation
 * Saleor sends auth token here during installation
 */
const handler = createAppRegisterHandler({
  apl: saleorApp.apl,
  /**
   * Allow Saleor URLs for app registration
   * The parameter is a string URL, not a URL object
   */
  allowedSaleorUrls: [
    (saleorApiUrl: string) => {
      console.log('[Register] Checking Saleor URL:', saleorApiUrl);

      // In development, allow everything
      if (process.env.NODE_ENV === 'development') {
        console.log('[Register] Development mode - allowing:', saleorApiUrl);
        return true;
      }

      // In production, check against allowed hosts
      try {
        const url = new URL(saleorApiUrl);
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
        console.error('[Register] Invalid URL:', saleorApiUrl, error);
        return false;
      }
    },
  ],
});

export default handler;
