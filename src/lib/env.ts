/**
 * Environment variables helper
 */
export const env = {
  APL: process.env.APL || 'file',
  SECRET_KEY: process.env.SECRET_KEY || '',
  SALEOR_API_URL: process.env.SALEOR_API_URL || '',
  APP_API_BASE_URL: process.env.APP_API_BASE_URL || '',
  APP_IFRAME_BASE_URL: process.env.APP_IFRAME_BASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
