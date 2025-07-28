import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Shield, Loader2 } from 'lucide-react';

export function SimpleLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthLogin = () => {
    setIsLoading(true);
    
    // Generate state for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('lightspeed-oauth-state', state);

    // Direct OAuth URL with hardcoded values to avoid API call
    const oauthParams = new URLSearchParams({
      client_id: '0da080a6fe48646365e4ebb427623d45179c98d306c270090b30c8d507c95e0',
      redirect_uri: 'https://inventory.outlined.ca/oauth/callback',
      scope: 'employee:register employee:inventory',
      state: state,
      response_type: 'code'
    });

    const oauthUrl = `https://cloud.lightspeedapp.com/auth/oauth/authorize?${oauthParams}`;
    
    console.log('Redirecting to OAuth URL:', oauthUrl);
    
    // Redirect to Lightspeed OAuth
    window.location.href = oauthUrl;
  };

  const handleDemoMode = () => {
    // Set demo mode flag
    localStorage.setItem('lightspeed-demo-mode', 'true');
    localStorage.setItem('lightspeed-authenticated', 'true');
    window.location.href = '/inventory';
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
              disabled={isLoading}
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
              Secure OAuth 2.0 authentication with Lightspeed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}