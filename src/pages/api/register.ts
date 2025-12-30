import { createAppRegisterHandler } from '@saleor/app-sdk/handlers/next';
import { saleorApp } from '@/saleor-app';

/**
 * Required endpoint for app installation
 * Saleor sends auth token here during installation
 */
const handler = createAppRegisterHandler({
  apl: saleorApp.apl,
  /**
   * Allow all URLs in development, restrict in production
   * The parameter is a string URL, not a URL object
   */
  allowedSaleorUrls: [
    (saleorApiUrl: string) => {
      // In development, allow everything
      if (process.env.NODE_ENV === 'development') {
        console.log('[Register] Allowing Saleor URL:', saleorApiUrl);
        return true;
      }
      
      // In production, parse and check hostname
      try {
        const url = new URL(saleorApiUrl);
        const allowedHosts = [
          'your-production-saleor.com',
          'localhost',
        ];
        
        return allowedHosts.includes(url.hostname);
      } catch (error) {
        console.error('[Register] Invalid URL:', saleorApiUrl);
        return false;
      }
    },
  ],
});

export default handler;
