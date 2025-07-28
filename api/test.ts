import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Test endpoint called');
    console.log('Environment variables:', {
      hasApiKey: !!process.env.LIGHTSPEED_API_KEY,
      hasSecret: !!process.env.LIGHTSPEED_SECRET,
      hasCluster: !!process.env.LIGHTSPEED_CLUSTER,
      cluster: process.env.LIGHTSPEED_CLUSTER
    });

    res.status(200).json({ 
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      environment: {
        hasApiKey: !!process.env.LIGHTSPEED_API_KEY,
        hasSecret: !!process.env.LIGHTSPEED_SECRET,
        hasCluster: !!process.env.LIGHTSPEED_CLUSTER,
        cluster: process.env.LIGHTSPEED_CLUSTER
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test endpoint failed' });
  }
}