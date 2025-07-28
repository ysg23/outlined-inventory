import { VercelRequest, VercelResponse } from '@vercel/node';

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categories: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get credentials from request headers (sent by frontend)
    const authHeader = req.headers.authorization;
    const accountId = req.headers['x-account-id'] as string;

    if (!authHeader || !authHeader.startsWith('Bearer ') || !accountId) {
      return res.status(401).json({ 
        error: 'Missing authentication credentials',
        message: 'Please provide access token and account ID in headers'
      });
    }

    const accessToken = authHeader.replace('Bearer ', '');

    const credentials = {
      accessToken,
      accountId,
    };

    console.log('Stats API - Using OAuth credentials:', {
      hasAccessToken: !!credentials.accessToken,
      hasAccountId: !!credentials.accountId,
      accountId: credentials.accountId
    });

    // Create base URL for R-Series API V3
    const baseUrl = `https://api.lightspeedapp.com/API/V3/Account/${credentials.accountId}`;
    
    // Create auth header for OAuth Bearer token
    const headers = {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json',
    };

    // Fetch variants data for stats
    const variantsResponse = await fetch(`${baseUrl}/ItemMatrix.json?load_relations=["Item"]&limit=100`, { headers });

    if (!variantsResponse.ok) {
      throw new Error('Failed to fetch data from Lightspeed API');
    }

    const variantsData = await variantsResponse.json();
    const variants = variantsData.ItemMatrix || [];

    // Calculate stats
    let totalItems = 0;
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const categorySet = new Set<string>();

    variants.forEach((variant: any) => {
      const quantity = parseInt(variant.qoh || '0');
      const price = parseFloat(variant.defaultCost || '0');
      
      totalItems += quantity;
      totalValue += quantity * price;
      
      if (quantity === 0) {
        outOfStockCount++;
      } else if (quantity < 5) {
        lowStockCount++;
      }
      
      // Add category (simplified)
      const category = categorizeProduct(variant.Item?.description || '');
      categorySet.add(category);
    });

    const stats: InventoryStats = {
      totalItems,
      totalValue,
      lowStockCount,
      outOfStockCount,
      categories: Array.from(categorySet),
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({ error: 'Failed to fetch inventory stats' });
  }
}

function categorizeProduct(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('shirt') || titleLower.includes('tee') || titleLower.includes('top')) {
    return 'Shirts & Tops';
  } else if (titleLower.includes('pant') || titleLower.includes('jean') || titleLower.includes('trouser')) {
    return 'Pants & Bottoms';
  } else if (titleLower.includes('shoe') || titleLower.includes('boot') || titleLower.includes('sneaker')) {
    return 'Footwear';
  } else if (titleLower.includes('jacket') || titleLower.includes('coat') || titleLower.includes('hoodie')) {
    return 'Outerwear';
  } else if (titleLower.includes('dress') || titleLower.includes('skirt')) {
    return 'Dresses & Skirts';
  } else if (titleLower.includes('accessory') || titleLower.includes('hat') || titleLower.includes('bag')) {
    return 'Accessories';
  }
  
  return 'General';
}