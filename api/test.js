export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Test endpoint called');
    
    const environment = {
      hasClientId: !!process.env.LIGHTSPEED_CLIENT_ID,
      hasClientSecret: !!process.env.LIGHTSPEED_CLIENT_SECRET,
      hasRedirectUri: !!process.env.LIGHTSPEED_REDIRECT_URI,
      hasCluster: !!process.env.LIGHTSPEED_CLUSTER,
      redirectUri: process.env.LIGHTSPEED_REDIRECT_URI,
      cluster: process.env.LIGHTSPEED_CLUSTER
    };

    console.log('Environment variables:', environment);

    res.status(200).json({ 
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      environment,
      nodeVersion: process.version,
      platform: process.platform
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      error: 'Test endpoint failed', 
      details: error.message,
      stack: error.stack 
    });
  }
}