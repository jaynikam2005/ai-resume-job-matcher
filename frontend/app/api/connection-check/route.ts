import { NextRequest, NextResponse } from 'next/server';
import getConfig from 'next/config';

// Get server-side runtime config
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || { 
  serverRuntimeConfig: {}, 
  publicRuntimeConfig: {} 
};

export async function GET(req: NextRequest) {
  // Collect environment and configuration info
  const configInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    runtimeConfig: {
      // Filter out sensitive information
      server: {
        ...serverRuntimeConfig,
        // Remove any sensitive data if present
        apiSecret: serverRuntimeConfig.apiSecret ? '[REDACTED]' : undefined,
      },
      public: publicRuntimeConfig,
    },
    envVariables: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_AI_SERVICE_URL: process.env.NEXT_PUBLIC_AI_SERVICE_URL,
      // Include other non-sensitive env vars as needed
    },
  };

  // Define connection status type
  type ConnectionStatus = 'unknown' | 'success' | 'error';
  
  // Define connection test result type
  type ConnectionTestResult = {
    status: ConnectionStatus;
    message: string;
    time: number | null;
    statusCode?: number;
  };

  // Test connections to backend services
  const connectionTests = {
    backend: { status: 'unknown' as ConnectionStatus, message: '', time: null as number | null },
    aiService: { status: 'unknown' as ConnectionStatus, message: '', time: null as number | null },
  };

  // Function to test a connection with timeout
  const testConnection = async (url: string, timeoutMs = 5000): Promise<ConnectionTestResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const startTime = Date.now();
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      const endTime = Date.now();
      
      clearTimeout(timeoutId);
      return { 
        status: response.ok ? 'success' : 'error', 
        statusCode: response.status,
        message: response.ok ? 'Connection successful' : `HTTP error: ${response.status}`,
        time: endTime - startTime
      };
    } catch (error) {
      clearTimeout(timeoutId);
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      let errorMessage: string;
      
      if (isTimeout) {
        errorMessage = `Connection timeout after ${timeoutMs}ms`;
      } else {
        errorMessage = `Connection error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      return { 
        status: 'error', 
        message: errorMessage,
        time: null
      };
    }
  };

  // Test backend API connection
  const backendUrl = serverRuntimeConfig.apiUrl || process.env.NEXT_PUBLIC_API_URL;
  if (backendUrl) {
    try {
      connectionTests.backend = await testConnection(`${backendUrl}/actuator/health`);
    } catch (e) {
      connectionTests.backend.status = 'error';
      connectionTests.backend.message = e instanceof Error ? e.message : String(e);
    }
  } else {
    connectionTests.backend.message = 'Backend URL not configured';
  }

  // Test AI service connection
  const aiServiceUrl = serverRuntimeConfig.aiServiceUrl || process.env.NEXT_PUBLIC_AI_SERVICE_URL;
  if (aiServiceUrl) {
    try {
      connectionTests.aiService = await testConnection(`${aiServiceUrl}/health`);
    } catch (e) {
      connectionTests.aiService.status = 'error';
      connectionTests.aiService.message = e instanceof Error ? e.message : String(e);
    }
  } else {
    connectionTests.aiService.message = 'AI Service URL not configured';
  }

  return NextResponse.json({
    config: configInfo,
    connections: connectionTests,
    request: {
      url: req.url,
      headers: Object.fromEntries(req.headers),
    }
  });
}