import { NextRequest, NextResponse } from 'next/server';
import { apiConfig } from '@/lib/api';
import getConfig from 'next/config';

// Get server-side runtime config
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || { 
  serverRuntimeConfig: {}, 
  publicRuntimeConfig: {} 
};

export async function GET(request: NextRequest) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    api: {
      publicApiUrl: process.env.NEXT_PUBLIC_API_URL,
      internalApiUrl: process.env.INTERNAL_API_URL,
      resolvedApiUrl: apiConfig.baseURL,
      
      publicAiServiceUrl: process.env.NEXT_PUBLIC_AI_SERVICE_URL,
      internalAiServiceUrl: process.env.INTERNAL_AI_SERVICE_URL,
      resolvedAiServiceUrl: apiConfig.aiServiceURL,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      isServer: typeof window === 'undefined',
    },
    // Next.js runtime config (safe values only)
    runtimeConfig: {
      public: publicRuntimeConfig,
      // Filter sensitive data from server runtime config
      server: Object.fromEntries(
        Object.entries(serverRuntimeConfig)
          .filter(([key]) => !key.toLowerCase().includes('secret') && !key.toLowerCase().includes('password'))
          .map(([key, value]) => [key, value])
      )
    },
    request: {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers),
    }
  };
  
  return NextResponse.json(debugInfo);
}