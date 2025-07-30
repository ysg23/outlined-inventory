import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Shield, Loader2 } from 'lucide-react';

export function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [oauthConfig, setOauthConfig] = useState<any>(null);

  // Load OAuth configuration on component mount
  useEffect(() => {
    fetch('/api/oauth')
      .then(res => res.json())
      .then(config => setOauthConfig(config))
      .catch(err => console.error('Failed to load OAuth config:', err));
  }, []);

  const handleOAuthLogin = async () => {
    if (!oauthConfig) {
      alert('OAuth configuration not loaded. Please try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate state for security
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('lightspeed-oauth-state', state);

      // Generate PKCE code verifier and challenge (required by Lightspeed)
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Store code verifier for later use in token exchange
      localStorage.setItem('lightspeed-code-verifier', codeVerifier);

      // Build OAuth URL using Lightspeed R-Series OAuth endpoint
      const oauthParams = new URLSearchParams({
        client_id: oauthConfig.clientId,
        redirect_uri: oauthConfig.redirectUri,
        scope: oauthConfig.scopes,
        state: state,
        response_type: 'code',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      });

      const oauthUrl = `${oauthConfig.authUrl}?${oauthParams}`;
      
      console.log('Redirecting to OAuth URL:', oauthUrl);
      
      // Redirect to Lightspeed OAuth
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('OAuth login error:', error);
      alert('Failed to initiate OAuth login. Please try again.');
      setIsLoading(false);
    }
  };

  // Generate PKCE code verifier (43-128 characters, base64url safe)
  const generateCodeVerifier = (): string => {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .substring(0, 128);
  };

  // Generate PKCE code challenge (SHA256 hash of verifier, base64url encoded)
  const generateCodeChallenge = async (verifier: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const base64String = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64String
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const handleDemoMode = () => {
    // Set demo mode flag
    localStorage.setItem('lightspeed-demo-mode', 'true');
    localStorage.setItem('lightspeed-authenticated', 'true');
    navigate('/inventory');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Access Inventory Dashboard</CardTitle>
          <CardDescription>
            Connect with your Lightspeed account to view your inventory
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Click below to securely connect with your Lightspeed Retail account
              </p>
            </div>
            
            <Button 
              onClick={handleOAuthLogin} 
              className="w-full" 
              disabled={isLoading || !oauthConfig}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect with Lightspeed
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleDemoMode}
            className="w-full"
          >
            Try Demo Mode
          </Button>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Need help setting up your API credentials?
            </p>
            <Button variant="link" size="sm" asChild>
              <a 
                href="https://developers.lightspeedhq.com/retail/introduction/introduction/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs"
              >
                View Lightspeed Documentation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}