'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiConfig } from '@/lib/api';

export function ConfigDebugger() {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [apiCheckResult, setApiCheckResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  const checkApiConnections = async () => {
    setIsChecking(true);
    try {
      // Check API configuration
      const apiResult = await fetch('/api/connection-check');
      setApiCheckResult(await apiResult.json());
    } catch (error) {
      setApiCheckResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsChecking(false);
    }
  };

  if (!showDebugInfo) {
    return (
      <div className="mt-8 text-center">
        <Button variant="ghost" size="sm" onClick={toggleDebugInfo}>
          Show Configuration Debug Info
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Configuration Debug Info</span>
          <Button variant="ghost" size="sm" onClick={toggleDebugInfo}>
            Hide
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        <div>
          <h3 className="font-medium mb-2">API Configuration:</h3>
          <pre className="bg-muted p-2 rounded-md overflow-auto text-xs">
            {JSON.stringify({
              apiBaseUrl: apiConfig.baseURL,
              aiServiceUrl: apiConfig.aiServiceURL,
              environment: {
                nodeEnv: process.env.NODE_ENV,
                isServer: typeof window === 'undefined',
                publicApiUrl: process.env.NEXT_PUBLIC_API_URL,
              }
            }, null, 2)}
          </pre>
        </div>

        <div className="pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={checkApiConnections}
            disabled={isChecking}
          >
            {isChecking ? 'Checking...' : 'Check API Connections'}
          </Button>
          
          {apiCheckResult && (
            <div className="mt-2">
              <pre className="bg-muted p-2 rounded-md overflow-auto text-xs">
                {JSON.stringify(apiCheckResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}