import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Optimize server components
    serverComponentsExternalPackages: ['@solana/web3.js', '@solana/spl-token'],
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu'],
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunk for stable dependencies
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          // Solana-specific chunk (large dependencies)
          solana: {
            test: /[\\/]node_modules[\\/](@solana|@jup-ag)[\\/]/,
            name: 'solana',
            priority: 20,
            reuseExistingChunk: true,
          },
          // UI components chunk
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            priority: 15,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Compression
  compress: true,

  // Power optimizations
  poweredByHeader: false,

  // Generate static pages where possible
  output: 'standalone',

  // Environment-specific optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Production-only optimizations
    swcMinify: true,
    
    // Headers for performance
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
          ],
        },
        {
          source: '/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
  }),
};

export default withBundleAnalyzer(nextConfig); 