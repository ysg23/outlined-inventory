import { useState, useEffect } from 'react';
import { Package, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { InventoryDashboard } from '@/components/inventory/inventory-dashboard';
import { apiClient } from '@/lib/api-client';

export default function Index() {
  const [apiStatus, setApiStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState<string>('');
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setApiStatus('testing');
      setError('');
      
      // First test basic endpoint
      console.log('Testing basic endpoint...');
      const testResponse = await fetch('/api/test');
      console.log('Test endpoint response:', testResponse.status);
      
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log('Test endpoint data:', testData);
      }
      
      // Then test the actual API connection by trying to fetch inventory
      console.log('Testing inventory endpoint...');
      await apiClient.getInventory();
      
      setApiStatus('connected');
    } catch (err) {
      console.error('API test failed:', err);
      setApiStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to connect to Lightspeed API');
    }
  };

  if (showDashboard) {
    return <InventoryDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-2xl shadow-xl border p-8 text-center">
          <div className="mb-6">
            <Package className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Lightspeed Inventory Dashboard
            </h1>
            <p className="text-muted-foreground">
              Testing API connection...
            </p>
          </div>

          <div className="space-y-6">
            {/* API Status */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-3 mb-2">
                {apiStatus === 'testing' && (
                  <>
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    <span className="text-foreground font-medium">Testing Connection...</span>
                  </>
                )}
                {apiStatus === 'connected' && (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">API Connected!</span>
                  </>
                )}
                {apiStatus === 'error' && (
                  <>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="text-destructive font-medium">Connection Failed</span>
                  </>
                )}
              </div>
              
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {apiStatus === 'connected' && (
                <button
                  onClick={() => setShowDashboard(true)}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Open Inventory Dashboard
                </button>
              )}
              
              {apiStatus === 'error' && (
                <button
                  onClick={testApiConnection}
                  className="w-full bg-muted text-foreground py-3 px-6 rounded-lg font-medium hover:bg-muted/80 transition-colors border border-border"
                >
                  Retry Connection
                </button>
              )}
            </div>

            {/* Status Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Using environment variables:</p>
              <p>• LIGHTSPEED_ACCESS_TOKEN</p>
              <p>• LIGHTSPEED_ACCOUNT_ID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}