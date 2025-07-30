export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return OAuth configuration for frontend
    const clientId = process.env.LIGHTSPEED_CLIENT_ID;
    const redirectUri = process.env.LIGHTSPEED_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      return res.status(500).json({ 
        error: 'Missing OAuth configuration',
        debug: {
          hasClientId: !!clientId,
          hasRedirectUri: !!redirectUri
        }
      });
    }

    return res.status(200).json({
      clientId,
      redirectUri: 'https://outlined-inventory.vercel.app/oauth/callback',
      authUrl: 'https://cloud.lightspeedapp.com/auth/oauth/authorize',
      scopes: 'employee:register+employee:inventory'
    });
  }

  if (req.method === 'POST') {
    // Exchange authorization code for access token
    const { code, state, code_verifier } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    if (!code_verifier) {
      return res.status(400).json({ error: 'PKCE code verifier is required' });
    }

    const clientId = process.env.LIGHTSPEED_CLIENT_ID;
    const clientSecret = process.env.LIGHTSPEED_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Missing OAuth client credentials' });
    }

    try {
      // Exchange code for access token with PKCE
      const tokenResponse = await fetch('https://cloud.lightspeedapp.com/auth/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          code: code,
          code_verifier: code_verifier
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', errorText);
        return res.status(400).json({ 
          error: 'Failed to exchange authorization code for access token',
          details: errorText
        });
      }

      const tokenData = await tokenResponse.json();
      
      // Get account information
      const accountResponse = await fetch('https://api.lightspeedapp.com/API/V3/Account.json', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      if (!accountResponse.ok) {
        throw new Error('Failed to fetch account information');
      }

      const accountData = await accountResponse.json();
      const accountId = accountData.Account?.[0]?.accountID;

      if (!accountId) {
        throw new Error('No account ID found in account response');
      }

      return res.status(200).json({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        account_id: accountId,
        token_type: tokenData.token_type
      });

    } catch (error) {
      console.error('OAuth token exchange error:', error);
      return res.status(500).json({ 
        error: 'Failed to complete OAuth flow',
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}