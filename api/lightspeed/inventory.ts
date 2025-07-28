import { VercelRequest, VercelResponse } from '@vercel/node';

interface LightspeedCredentials {
  apiKey: string;
  secret: string;
  cluster: string;
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Environment variables check:', {
      hasApiKey: !!process.env.LIGHTSPEED_API_KEY,
      hasSecret: !!process.env.LIGHTSPEED_SECRET,
      hasCluster: !!process.env.LIGHTSPEED_CLUSTER,
      cluster: process.env.LIGHTSPEED_CLUSTER
    });

    const credentials: LightspeedCredentials = {
      apiKey: process.env.LIGHTSPEED_API_KEY || '',
      secret: process.env.LIGHTSPEED_SECRET || '',
      cluster: process.env.LIGHTSPEED_CLUSTER || '',
    };

    if (!credentials.apiKey || !credentials.secret || !credentials.cluster) {
      console.error('Missing credentials:', credentials);
      return res.status(500).json({ 
        error: 'Missing Lightspeed credentials',
        debug: {
          hasApiKey: !!credentials.apiKey,
          hasSecret: !!credentials.secret,
          hasCluster: !!credentials.cluster
        }
      });
    }

    const { size } = req.query;
    
    // Create base URL for R-Series API
    const baseUrl = `https://api.lightspeedapp.com/API/Account/${credentials.cluster}`;
    
    // Create auth header
    const auth = Buffer.from(`${credentials.apiKey}:${credentials.secret}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${auth}`,
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