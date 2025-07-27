// Lightspeed API Types for Inventory Management

export interface LightspeedCredentials {
  apiKey: string;
  secret: string;
  cluster: 'eu1' | 'us1';
  domain?: string; // For X-Series
  accessToken?: string; // For X-Series OAuth
}

export interface LightspeedProduct {
  id: number;
  createdAt: string;
  updatedAt: string;
  isVisible: boolean;
  visibility: 'visible' | 'hidden' | 'auto';
  title: string;
  fulltitle: string;
  description: string;
  content: string;
  url: string;
  brand?: {
    resource: {
      id: number;
      url: string;
      link: string;
    };
  };
  image?: {
    thumb: string;
    src: string;
    title: string;
  };
  variants: {
    resource: {
      id: false;
      url: string;
      link: string;
    };
  };
  set?: ProductOptionSet;
}

export interface ProductOptionSet {
  id: number;
  name: string;
  options: ProductOption[];
}

export interface ProductOption {
  id: number;
  sortOrder: number;
  name: string;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: number;
  sortOrder: number;
  name: string;
}

export interface LightspeedVariant {
  id: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  sortOrder: number;
  articleCode: string;
  ean: string;
  sku: string;
  priceExcl: number;
  priceIncl: number;
  priceCost: number;
  stockTracking: 'disabled' | 'enabled' | 'indicator';
  stockLevel: number;
  stockAlert: number;
  stockMinimum: number;
  stockSold: number;
  title: string;
  weight: number;
  image?: {
    thumb: string;
    src: string;
    title: string;
  };
  product: {
    resource: {
      id: number;
      url: string;
      link: string;
    };
  };
  options: VariantOption[];
}

export interface VariantOption {
  id: number;
  name: string;
  value: {
    id: number;
    name: string;
    sortOrder: number;
  };
  sortOrder: number;
}

// X-Series Types (newer API)
export interface XSeriesProduct {
  id: string;
  name: string;
  variant_name: string;
  description?: string;
  has_variants: boolean;
  variant_parent_id?: string;
  variant_options: XSeriesVariantOption[];
  product_codes: ProductCode[];
  pricing: ProductPricing;
  inventory: ProductInventory;
}

export interface XSeriesVariantOption {
  id: string;
  name: string;
  value: string;
}

export interface ProductCode {
  code: string;
  type: string;
}

export interface ProductPricing {
  default_price: number;
  currency: string;
}

export interface ProductInventory {
  outlet_quantities: OutletQuantity[];
  total_quantity: number;
}

export interface OutletQuantity {
  outlet_id: string;
  outlet_name: string;
  quantity: number;
}

// Dashboard specific types
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  variantName: string;
  sku: string;
  ean: string;
  size?: string;
  color?: string;
  category?: string;
  brand?: string;
  price: number;
  stockLevel: number;
  stockAlert: number;
  image?: string;
  lastUpdated: string;
}

export interface SizeFilter {
  category: 'clothing' | 'shoes' | 'accessories';
  sizes: string[];
}

export interface InventoryFilters {
  sizes: string[];
  categories: string[];
  brands: string[];
  inStock: boolean;
  lowStock: boolean;
  searchTerm: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoriesCount: number;
}