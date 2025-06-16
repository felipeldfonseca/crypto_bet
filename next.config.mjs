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

  // 🔒 ENTERPRISE-GRADE SECURITY HEADERS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 🛡️ XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // 🔒 Content Type Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // 🚫 Clickjacking Protection
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // 🔐 DNS Prefetch Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // 🛡️ Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // 🔒 Permissions Policy (Feature Policy)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
          },
          // 🚨 Content Security Policy (CSP)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://api.mainnet-beta.solana.com https://api.devnet.solana.com https://quote-api.jup.ag https://price.jup.ag wss://api.mainnet-beta.solana.com wss://api.devnet.solana.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // 🔐 Strict Transport Security (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ],
      },
      // 📦 Static Assets Caching
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 🎨 Font Optimization
      {
        source: '/_next/static/media/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Environment-specific optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Production-only optimizations
    swcMinify: true,
  }),
};

export default withBundleAnalyzer(nextConfig); 