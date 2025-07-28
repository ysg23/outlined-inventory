import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Shield } from 'lucide-react';

export function LoginForm() {
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthLogin = () => {
    if (!domain.trim()) {
      alert('Please enter your store domain');
      return;
    }

    setIsLoading(true);
    
    // Generate state for security
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('lightspeed-oauth-state', state);
    localStorage.setItem('lightspeed-oauth-domain', domain);

    // Build OAuth URL
    const oauthParams = new URLSearchParams({
      client_id: 'your-client-id', // This would be configured
      redirect_uri: 'https://inventory.outlined.ca/oauth/callback',
      scope: 'read:products read:variants',
      state: state,
      response_type: 'code'
    });

    const oauthUrl = `https://${domain}.retail.lightspeed.app/oauth/authorize?${oauthParams}`;
    
    // Redirect to Lightspeed OAuth
    window.location.href = oauthUrl;
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
              <Label htmlFor="domain">Store Domain</Label>
              <Input
                id="domain"
                placeholder="your-store-name"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOAuthLogin()}
              />
              <p className="text-xs text-muted-foreground">
                Enter your Lightspeed store domain (without .retail.lightspeed.app)
              </p>
            </div>
            
            <Button 
              onClick={handleOAuthLogin} 
              className="w-full" 
              disabled={isLoading || !domain.trim()}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect with Lightspeed
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