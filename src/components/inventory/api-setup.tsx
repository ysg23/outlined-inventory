import { useState } from 'react';
import { Eye, EyeOff, Info, ExternalLink } from 'lucide-react';
import { LightspeedCredentials } from '@/types/lightspeed';

interface ApiSetupProps {
  onCredentialsSubmit: (credentials: LightspeedCredentials) => void;
}

export function ApiSetup({ onCredentialsSubmit }: ApiSetupProps) {
  const [credentials, setCredentials] = useState<LightspeedCredentials>({
    apiKey: '',
    secret: '',
    cluster: 'us1',
    domain: '',
    accessToken: '',
  });
  const [apiVersion, setApiVersion] = useState<'r-series' | 'x-series'>('r-series');
  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up credentials based on API version
    const cleanCredentials: LightspeedCredentials = {
      apiKey: credentials.apiKey,
      secret: credentials.secret,
      cluster: credentials.cluster,
    };

    if (apiVersion === 'x-series') {
      cleanCredentials.domain = credentials.domain;
      cleanCredentials.accessToken = credentials.accessToken;
    }

    onCredentialsSubmit(cleanCredentials);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Lightspeed API Setup
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Configure your Lightspeed API credentials to access your inventory
          </p>
        </div>

        <div className="bg-card rounded-lg shadow p-8 border">
          {/* API Version Selection */}
          <div className="mb-6">
            <label className="text-base font-medium text-foreground">API Version</label>
            <p className="text-sm leading-5 text-muted-foreground">
              Choose your Lightspeed API version
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">API Version</legend>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="r-series"
                    name="api-version"
                    type="radio"
                    checked={apiVersion === 'r-series'}
                    onChange={() => setApiVersion('r-series')}
                    className="h-4 w-4 text-primary focus:ring-primary border-border"
                  />
                  <label htmlFor="r-series" className="ml-3 block text-sm font-medium text-foreground">
                    R-Series (eCom) - Legacy API
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="x-series"
                    name="api-version"
                    type="radio"
                    checked={apiVersion === 'x-series'}
                    onChange={() => setApiVersion('x-series')}
                    className="h-4 w-4 text-primary focus:ring-primary border-border"
                  />
                  <label htmlFor="x-series" className="ml-3 block text-sm font-medium text-foreground">
                    X-Series (Retail) - Modern API
                  </label>
                </div>
              </div>
            </fieldset>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {apiVersion === 'r-series' ? (
              <>
                {/* R-Series Fields */}
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-foreground">
                    API Key
                  </label>
                  <input
                    id="apiKey"
                    name="apiKey"
                    type="text"
                    required
                    value={credentials.apiKey}
                    onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
                    placeholder="Your API key"
                  />
                </div>

                <div>
                  <label htmlFor="secret" className="block text-sm font-medium text-foreground">
                    API Secret
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="secret"
                      name="secret"
                      type={showSecret ? 'text' : 'password'}
                      required
                      value={credentials.secret}
                      onChange={(e) => setCredentials(prev => ({ ...prev, secret: e.target.value }))}
                      className="appearance-none relative block w-full px-3 py-2 pr-10 border border-input placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
                      placeholder="Your API secret"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="cluster" className="block text-sm font-medium text-foreground">
                    Cluster
                  </label>
                  <select
                    id="cluster"
                    name="cluster"
                    value={credentials.cluster}
                    onChange={(e) => setCredentials(prev => ({ ...prev, cluster: e.target.value as 'us1' | 'eu1' }))}
                    className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-foreground"
                  >
                    <option value="us1">US1 (api.shoplightspeed.com)</option>
                    <option value="eu1">EU1 (api.webshopapp.com)</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* X-Series Fields */}
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-foreground">
                    Domain Prefix
                  </label>
                  <input
                    id="domain"
                    name="domain"
                    type="text"
                    required
                    value={credentials.domain}
                    onChange={(e) => setCredentials(prev => ({ ...prev, domain: e.target.value }))}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
                    placeholder="your-store"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    The domain prefix from your Lightspeed URL (e.g., "your-store" from "your-store.retail.lightspeed.app")
                  </p>
                </div>

                <div>
                  <label htmlFor="accessToken" className="block text-sm font-medium text-foreground">
                    Access Token
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="accessToken"
                      name="accessToken"
                      type={showToken ? 'text' : 'password'}
                      required
                      value={credentials.accessToken}
                      onChange={(e) => setCredentials(prev => ({ ...prev, accessToken: e.target.value }))}
                      className="appearance-none relative block w-full px-3 py-2 pr-10 border border-input placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
                      placeholder="Your access token"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Connect to Lightspeed
              </button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-6 border-t border-border pt-6">
            <div className="rounded-md bg-muted p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-foreground">
                    Need help getting your API credentials?
                  </h3>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>
                      {apiVersion === 'r-series' ? (
                        <>
                          For R-Series (eCom): Visit your Lightspeed eCom admin panel → Apps → 
                          Private Apps to create API credentials.
                        </>
                      ) : (
                        <>
                          For X-Series (Retail): Visit your Lightspeed Retail admin panel → 
                          Settings → API to generate a personal token or set up OAuth.
                        </>
                      )}
                    </p>
                    <p className="mt-2">
                      <a
                        href="https://developers.lightspeedhq.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline hover:text-foreground inline-flex items-center"
                      >
                        View Lightspeed API Documentation
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}