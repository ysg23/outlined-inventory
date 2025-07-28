import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { CredentialManager } from '@/lib/credential-manager';
import { LightspeedCredentials } from '@/types/lightspeed';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Verify OAuth state for security
        const storedState = localStorage.getItem('lightspeed-oauth-state');
        if (!storedState || storedState !== state) {
          throw new Error('Invalid OAuth state - possible CSRF attack');
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch('/api/oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            state: state
          })
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(errorData.error || 'Failed to exchange authorization code');
        }

        const tokenData = await tokenResponse.json();

        // Save the access token and account ID securely
        const credentials: LightspeedCredentials = {
          accessToken: tokenData.access_token,
          apiKey: '', // Not needed for OAuth
          secret: '', // Not needed for OAuth
          cluster: 'us1', // Default cluster
          domain: '' // Not needed for R-Series
        };

        // Save credentials and additional OAuth data
        CredentialManager.saveCredentials(credentials);
        localStorage.setItem('lightspeed-access-token', tokenData.access_token);
        localStorage.setItem('lightspeed-account-id', tokenData.account_id);
        localStorage.setItem('lightspeed-refresh-token', tokenData.refresh_token);
        localStorage.setItem('lightspeed-token-expires', (Date.now() + (tokenData.expires_in * 1000)).toString());
        
        // Mark as authenticated
        localStorage.setItem('lightspeed-authenticated', 'true');
        
        // Clean up OAuth state
        localStorage.removeItem('lightspeed-oauth-state');
        localStorage.removeItem('lightspeed-oauth-domain');

        setStatus('success');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/inventory');
        }, 2000);

      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
            
            {status === 'loading' && 'Connecting...'}
            {status === 'success' && 'Connected!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your Lightspeed credentials...'}
            {status === 'success' && 'Successfully connected to Lightspeed. Redirecting to dashboard...'}
            {status === 'error' && 'There was an issue connecting to your Lightspeed account.'}
          </CardDescription>
        </CardHeader>
        
        {(status === 'error' || status === 'success') && (
          <CardContent className="text-center space-y-4">
            {error && (
              <p className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md">
                {error}
              </p>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Go Home
              </Button>
              {status === 'success' && (
                <Button 
                  onClick={() => navigate('/inventory')}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}