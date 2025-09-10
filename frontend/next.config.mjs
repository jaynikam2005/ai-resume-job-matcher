/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Enable webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Production optimizations
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    // Reduce bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
  
  // Experimental features for performance
  experimental: {
    scrollRestoration: true,
  },
  
  // Output configuration
  output: 'standalone',
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error', 'warn', 'info'] } 
      : false,
  },
  
  // Required for Docker networking
  serverRuntimeConfig: {
    // Server-only runtime config (not exposed to browser)
    internalApiUrl: process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL,
    internalAiServiceUrl: process.env.INTERNAL_AI_SERVICE_URL || process.env.NEXT_PUBLIC_AI_SERVICE_URL,
  },
  publicRuntimeConfig: {
    // Config accessible on both server and client
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    aiServiceUrl: process.env.NEXT_PUBLIC_AI_SERVICE_URL,
  },
}

export default nextConfig
