import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Test endpoint called');
    console.log('Environment variables:', {
      hasAccessToken: !!process.env.LIGHTSPEED_ACCESS_TOKEN,
      hasAccountId: !!process.env.LIGHTSPEED_ACCOUNT_ID,
      accountId: process.env.LIGHTSPEED_ACCOUNT_ID
    });

    res.status(200).json({ 
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      environment: {
        hasAccessToken: !!process.env.LIGHTSPEED_ACCESS_TOKEN,
        hasAccountId: !!process.env.LIGHTSPEED_ACCOUNT_ID,
        accountId: process.env.LIGHTSPEED_ACCOUNT_ID
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test endpoint failed' });
  }
}