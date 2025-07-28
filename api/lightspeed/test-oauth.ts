import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientId = process.env.LIGHTSPEED_CLIENT_ID;
    const clientSecret = process.env.LIGHTSPEED_CLIENT_SECRET;
    const redirectUri = process.env.LIGHTSPEED_REDIRECT_URI;
    const cluster = process.env.LIGHTSPEED_CLUSTER;

    const config = {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRedirectUri: !!redirectUri,
      hasCluster: !!cluster,
      clientId: clientId ? `${clientId.substring(0, 4)}...` : 'missing',
      redirectUri: redirectUri || 'missing',
      cluster: cluster || 'missing',
      authUrl: 'https://cloud.lightspeedapp.com/auth/oauth/authorize',
      tokenUrl: 'https://cloud.lightspeedapp.com/auth/oauth/token',
      apiUrl: 'https://api.lightspeedapp.com/API/V3',
      expectedScopes: [
        'employee:register',
        'employee:inventory',
        'employee:all', // Alternative scope that might be needed
        'read:products',
        'read:variants'
      ]
    };

    // Test if we can reach Lightspeed's OAuth endpoints
    let connectivityTest = {
      authEndpoint: 'unknown',
      tokenEndpoint: 'unknown'
    };

    try {
      // Test auth endpoint
      const authResponse = await fetch('https://cloud.lightspeedapp.com/auth/oauth/authorize', {
        method: 'HEAD'
      });
      connectivityTest.authEndpoint = authResponse.status < 500 ? 'reachable' : 'server_error';
    } catch (error) {
      connectivityTest.authEndpoint = 'unreachable';
    }

    try {
      // Test token endpoint  
      const tokenResponse = await fetch('https://cloud.lightspeedapp.com/auth/oauth/token', {
        method: 'HEAD'
      });
      connectivityTest.tokenEndpoint = tokenResponse.status < 500 ? 'reachable' : 'server_error';
    } catch (error) {
      connectivityTest.tokenEndpoint = 'unreachable';
    }

    return res.status(200).json({
      message: 'OAuth configuration test',
      timestamp: new Date().toISOString(),
      configuration: config,
      connectivity: connectivityTest,
      instructions: {
        nextSteps: [
          '1. Verify all environment variables are set correctly',
          '2. Ensure redirect URI matches exactly in Lightspeed app settings',
          '3. Check that the correct scopes are configured',
          '4. Test the OAuth flow by visiting /login'
        ],
        requiredEnvVars: [
          'LIGHTSPEED_CLIENT_ID',
          'LIGHTSPEED_CLIENT_SECRET', 
          'LIGHTSPEED_REDIRECT_URI',
          'LIGHTSPEED_CLUSTER (optional)'
        ]
      }
    });

  } catch (error) {
    console.error('OAuth test error:', error);
    return res.status(500).json({ 
      error: 'OAuth configuration test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}