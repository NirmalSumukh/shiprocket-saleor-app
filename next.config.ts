import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // For local Docker development
  async rewrites() {
    return [];
  },
  
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features
  },

  // Configure standalone for Docker builds (future)
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
};

export default nextConfig;
