import { VercelRequest, VercelResponse } from '@vercel/node';

interface LightspeedCredentials {
  accessToken: string;
  accountId: string;
}

interface AuthTokens {
  accessToken: string;
  accountId: string;
  refreshToken?: string;
}

interface InventoryItem {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  size?: string;
  category: string;
  brand?: string;
  sku: string;
  imageUrl?: string;
  inStock: boolean;
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

    const credentials: LightspeedCredentials = {
      accessToken,
      accountId,
    };

    console.log('Using OAuth credentials for inventory request:', {
      hasAccessToken: !!credentials.accessToken,
      hasAccountId: !!credentials.accountId,
      accountId: credentials.accountId
    });

    const { size } = req.query;
    
    // Create base URL for R-Series API V3
    const baseUrl = `https://api.lightspeedapp.com/API/V3/Account/${credentials.accountId}`;
    
    // Create auth header for OAuth Bearer token
    const headers = {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json',
    };

    console.log('Making API calls to:', baseUrl);

    // Fetch products and variants
    const [productsResponse, variantsResponse] = await Promise.all([
      fetch(`${baseUrl}/Item.json?load_relations=["Category","ItemShops"]&limit=100`, { headers }),
      fetch(`${baseUrl}/ItemMatrix.json?load_relations=["Item"]&limit=100`, { headers })
    ]);

    console.log('API Response status:', {
      products: productsResponse.status,
      variants: variantsResponse.status
    });

    if (!productsResponse.ok || !variantsResponse.ok) {
      const productError = !productsResponse.ok ? await productsResponse.text() : null;
      const variantError = !variantsResponse.ok ? await variantsResponse.text() : null;
      
      console.error('API call failed:', {
        productsStatus: productsResponse.status,
        variantsStatus: variantsResponse.status,
        productError,
        variantError
      });
      
      throw new Error(`Failed to fetch data from Lightspeed API. Products: ${productsResponse.status}, Variants: ${variantsResponse.status}`);
    }

    const productsData = await productsResponse.json();
    const variantsData = await variantsResponse.json();

    const products = productsData.Item || [];
    const variants = variantsData.ItemMatrix || [];

    // Transform data to inventory items
    const inventoryItems: InventoryItem[] = variants.map((variant: any) => {
      const product = products.find((p: any) => p.itemID === variant.itemID);
      const category = product?.Category?.name || 'Uncategorized';
      
      return {
        id: variant.itemMatrixID,
        title: product?.description || 'Unknown Product',
        description: product?.longDescription || '',
        price: parseFloat(variant.defaultCost || product?.defaultCost || '0'),
        quantity: parseInt(variant.qoh || '0'),
        size: variant.description,
        category: categorizeProduct(product?.description || ''),
        brand: extractBrand(product?.description || ''),
        sku: variant.customSku || product?.customSku || '',
        imageUrl: undefined,
        inStock: parseInt(variant.qoh || '0') > 0,
      };
    });

    // Filter by size if specified
    let filteredItems = inventoryItems;
    if (size && typeof size === 'string') {
      filteredItems = inventoryItems.filter(item => 
        item.size?.toLowerCase().includes(size.toLowerCase())
      );
    }

    res.status(200).json({ items: filteredItems });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory data' });
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

function extractBrand(title: string): string {
  // Simple brand extraction - you can enhance this based on your product naming
  const words = title.split(' ');
  return words[0] || 'Unknown';
}