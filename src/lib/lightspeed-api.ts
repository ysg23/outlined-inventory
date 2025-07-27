import {
  LightspeedCredentials,
  LightspeedProduct,
  LightspeedVariant,
  XSeriesProduct,
  InventoryItem,
  InventoryStats,
  InventoryFilters,
} from '@/types/lightspeed';

export class LightspeedAPI {
  private credentials: LightspeedCredentials;
  private baseUrl: string;

  constructor(credentials: LightspeedCredentials) {
    this.credentials = credentials;
    
    // Determine API version and base URL
    if (credentials.domain && credentials.accessToken) {
      // X-Series API
      this.baseUrl = `https://${credentials.domain}.retail.lightspeed.app/api`;
    } else {
      // R-Series API
      const clusterUrl = credentials.cluster === 'eu1' 
        ? 'https://api.webshopapp.com/en'
        : 'https://api.shoplightspeed.com/en';
      this.baseUrl = clusterUrl;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Custom-Inventory-Dashboard/1.0',
      ...(options.headers as Record<string, string>),
    };

    // Add authentication
    if (this.credentials.accessToken) {
      // X-Series OAuth
      headers['Authorization'] = `Bearer ${this.credentials.accessToken}`;
    } else {
      // R-Series Basic Auth
      const auth = btoa(`${this.credentials.apiKey}:${this.credentials.secret}`);
      headers['Authorization'] = `Basic ${auth}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lightspeed API Request Failed:', error);
      throw error;
    }
  }

  // R-Series API Methods
  async getProducts(limit = 250, page = 1): Promise<LightspeedProduct[]> {
    const endpoint = `/products.json?limit=${limit}&page=${page}`;
    const response = await this.makeRequest(endpoint);
    return Array.isArray(response.products) ? response.products : [response.product];
  }

  async getVariants(productId?: number, limit = 250, page = 1): Promise<LightspeedVariant[]> {
    const endpoint = productId 
      ? `/variants.json?product=${productId}&limit=${limit}&page=${page}`
      : `/variants.json?limit=${limit}&page=${page}`;
    const response = await this.makeRequest(endpoint);
    return Array.isArray(response.variants) ? response.variants : [response.variant];
  }

  async getVariantsBySize(size: string): Promise<LightspeedVariant[]> {
    // Get all variants and filter by size in options
    const allVariants = await this.getAllVariants();
    return allVariants.filter(variant => 
      variant.options.some(option => 
        option.name.toLowerCase().includes('size') && 
        option.value.name.toLowerCase().includes(size.toLowerCase())
      )
    );
  }

  async getAllVariants(): Promise<LightspeedVariant[]> {
    const allVariants: LightspeedVariant[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const variants = await this.getVariants(undefined, 250, page);
      allVariants.push(...variants);
      
      if (variants.length < 250) {
        hasMore = false;
      } else {
        page++;
      }
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allVariants;
  }

  // X-Series API Methods
  async getXSeriesProducts(limit = 200, offset = 0): Promise<XSeriesProduct[]> {
    const endpoint = `/2.0/products?limit=${limit}&offset=${offset}`;
    const response = await this.makeRequest(endpoint);
    return response.data || [];
  }

  async getXSeriesProductsBySize(size: string): Promise<XSeriesProduct[]> {
    // X-Series allows filtering by variant options
    const endpoint = `/2.0/products?filter[variant_options][Size]=${encodeURIComponent(size)}`;
    const response = await this.makeRequest(endpoint);
    return response.data || [];
  }

  // Unified methods that work with both APIs
  async getInventoryBySize(size: string): Promise<InventoryItem[]> {
    try {
      if (this.credentials.accessToken) {
        // X-Series
        const products = await this.getXSeriesProductsBySize(size);
        return this.transformXSeriesToInventoryItems(products);
      } else {
        // R-Series
        const variants = await this.getVariantsBySize(size);
        const products = await this.getProducts();
        return this.transformRSeriesToInventoryItems(variants, products);
      }
    } catch (error) {
      console.error('Error fetching inventory by size:', error);
      throw error;
    }
  }

  async getAllInventory(): Promise<InventoryItem[]> {
    try {
      if (this.credentials.accessToken) {
        // X-Series
        const products = await this.getAllXSeriesProducts();
        return this.transformXSeriesToInventoryItems(products);
      } else {
        // R-Series
        const [variants, products] = await Promise.all([
          this.getAllVariants(),
          this.getAllProducts()
        ]);
        return this.transformRSeriesToInventoryItems(variants, products);
      }
    } catch (error) {
      console.error('Error fetching all inventory:', error);
      throw error;
    }
  }

  async getAllXSeriesProducts(): Promise<XSeriesProduct[]> {
    const allProducts: XSeriesProduct[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const products = await this.getXSeriesProducts(200, offset);
      allProducts.push(...products);
      
      if (products.length < 200) {
        hasMore = false;
      } else {
        offset += 200;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allProducts;
  }

  async getAllProducts(): Promise<LightspeedProduct[]> {
    const allProducts: LightspeedProduct[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const products = await this.getProducts(250, page);
      allProducts.push(...products);
      
      if (products.length < 250) {
        hasMore = false;
      } else {
        page++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allProducts;
  }

  // Data transformation methods
  private transformRSeriesToInventoryItems(
    variants: LightspeedVariant[], 
    products: LightspeedProduct[]
  ): InventoryItem[] {
    const productMap = new Map(products.map(p => [p.id, p]));

    return variants.map(variant => {
      const product = productMap.get(variant.product.resource.id);
      const sizeOption = variant.options.find(opt => 
        opt.name.toLowerCase().includes('size')
      );
      const colorOption = variant.options.find(opt => 
        opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
      );

      return {
        id: variant.id.toString(),
        productId: variant.product.resource.id.toString(),
        productName: product?.title || 'Unknown Product',
        variantName: variant.title,
        sku: variant.sku,
        ean: variant.ean,
        size: sizeOption?.value.name,
        color: colorOption?.value.name,
        category: this.categorizeProduct(product?.title || ''),
        brand: product?.brand?.resource.id.toString(),
        price: variant.priceIncl,
        stockLevel: variant.stockLevel,
        stockAlert: variant.stockAlert,
        image: variant.image?.thumb || product?.image?.thumb,
        lastUpdated: variant.updatedAt,
      };
    });
  }

  private transformXSeriesToInventoryItems(products: XSeriesProduct[]): InventoryItem[] {
    return products.map(product => {
      const sizeOption = product.variant_options.find(opt => 
        opt.name.toLowerCase().includes('size')
      );
      const colorOption = product.variant_options.find(opt => 
        opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
      );

      return {
        id: product.id,
        productId: product.variant_parent_id || product.id,
        productName: product.name,
        variantName: product.variant_name,
        sku: product.product_codes.find(code => code.type === 'sku')?.code || '',
        ean: product.product_codes.find(code => code.type === 'ean')?.code || '',
        size: sizeOption?.value,
        color: colorOption?.value,
        category: this.categorizeProduct(product.name),
        brand: '', // Would need additional API call
        price: product.pricing.default_price,
        stockLevel: product.inventory.total_quantity,
        stockAlert: 5, // Default alert level
        image: '', // Would need additional API call
        lastUpdated: new Date().toISOString(),
      };
    });
  }

  private categorizeProduct(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('shirt') || lowerTitle.includes('tee') || lowerTitle.includes('hoodie') || 
        lowerTitle.includes('jacket') || lowerTitle.includes('pants') || lowerTitle.includes('jeans')) {
      return 'clothing';
    }
    
    if (lowerTitle.includes('shoe') || lowerTitle.includes('sneaker') || lowerTitle.includes('boot') ||
        lowerTitle.includes('sandal') || lowerTitle.includes('heel')) {
      return 'shoes';
    }
    
    return 'accessories';
  }

  async getInventoryStats(items?: InventoryItem[]): Promise<InventoryStats> {
    if (!items) {
      items = await this.getAllInventory();
    }

    const totalValue = items.reduce((sum, item) => sum + (item.price * item.stockLevel), 0);
    const lowStockItems = items.filter(item => item.stockLevel <= item.stockAlert).length;
    const outOfStockItems = items.filter(item => item.stockLevel === 0).length;
    const categories = new Set(items.map(item => item.category)).size;

    return {
      totalItems: items.length,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categoriesCount: categories,
    };
  }

  filterInventory(items: InventoryItem[], filters: InventoryFilters): InventoryItem[] {
    return items.filter(item => {
      // Size filter - exact match to avoid L matching XL
      if (filters.sizes.length > 0 && item.size && 
          !filters.sizes.some(size => item.size!.toLowerCase() === size.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && item.category && 
          !filters.categories.includes(item.category)) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && item.brand && 
          !filters.brands.includes(item.brand)) {
        return false;
      }

      // Stock filters
      if (filters.inStock && item.stockLevel === 0) {
        return false;
      }

      if (filters.lowStock && item.stockLevel > item.stockAlert) {
        return false;
      }

      // Search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = [
          item.productName,
          item.variantName,
          item.sku,
          item.ean,
          item.size,
          item.color
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }
}

// Utility function to create API instance
export function createLightspeedAPI(credentials: LightspeedCredentials): LightspeedAPI {
  return new LightspeedAPI(credentials);
}