export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      // Omitted for brevity, your GET is fine
    }

    if (req.method === 'POST') {
      // Manual body parsing (if needed)
      let body = req.body;
      if (!body || typeof body === 'string') {
        try { body = JSON.parse(req.body || '{}'); } catch { body = {}; }
      }
      const { code, code_verifier } = body;

      if (!code) return res.status(400).json({ error: 'Authorization code is required' });
      // Remove if not using PKCE, else keep check
      // if (!code_verifier) return res.status(400).json({ error: 'PKCE code verifier is required' });

      const clientId = process.env.LIGHTSPEED_CLIENT_ID;
      const clientSecret = process.env.LIGHTSPEED_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.status(500).json({ error: 'Missing OAuth client credentials' });
      }

      // EXCHANGE for token, form-encoded!
      const tokenBody = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        ...(code_verifier ? { code_verifier } : {})
      }).toString();

      const tokenResponse = await fetch('https://cloud.lightspeedapp.com/auth/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenBody,
      });

      const text = await tokenResponse.text();
      let tokenData;
      try { tokenData = JSON.parse(text); } catch { tokenData = { error: text }; }
      if (!tokenResponse.ok || !tokenData.access_token) {
        return res.status(400).json({ error: 'Failed to exchange authorization code', details: tokenData });
      }

      // Fetch account info (optional)
      // ...

      return res.status(200).json({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type || 'Bearer'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('OAuth endpoint error:', error);
    return res.status(500).json({ error: 'OAuth endpoint failed', message: error.message });
  }
}
