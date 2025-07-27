import { useState } from 'react';
import { InventoryItem, InventoryFilters } from '@/types/lightspeed';
import { InventoryCard } from './inventory-card';
import { InventoryFiltersComponent } from './inventory-filters';
import { InventoryStatsComponent } from './inventory-stats';
import { SizeSelector } from './size-selector';
import { Search, Play } from 'lucide-react';

// Mock inventory data for demonstration - Based on real outlined.ca products
const mockInventoryData: InventoryItem[] = [
  // SNEAKERS - Nike Kobe 6 with multiple sizes
  {
    id: '1',
    productId: '301',
    productName: 'Nike Kobe 6 Protro "Total Orange"',
    variantName: 'Nike Kobe 6 Protro "Total Orange" - Size 9',
    sku: 'KOBE6-TO-9',
    ean: '194272538283',
    size: '9',
    color: 'Total Orange',
    category: 'shoes',
    brand: 'Nike',
    price: 550.00,
    stockLevel: 2,
    stockAlert: 3,
    lastUpdated: '2024-12-16T10:30:00Z',
  },
  {
    id: '1b',
    productId: '301',
    productName: 'Nike Kobe 6 Protro "Total Orange"',
    variantName: 'Nike Kobe 6 Protro "Total Orange" - Size 10',
    sku: 'KOBE6-TO-10',
    ean: '194272538290',
    size: '10',
    color: 'Total Orange',
    category: 'shoes',
    brand: 'Nike',
    price: 550.00,
    stockLevel: 5,
    stockAlert: 3,
    lastUpdated: '2024-12-16T10:30:00Z',
  },
  {
    id: '1c',
    productId: '301',
    productName: 'Nike Kobe 6 Protro "Total Orange"',
    variantName: 'Nike Kobe 6 Protro "Total Orange" - Size 11',
    sku: 'KOBE6-TO-11',
    ean: '194272538306',
    size: '11',
    color: 'Total Orange',
    category: 'shoes',
    brand: 'Nike',
    price: 550.00,
    stockLevel: 1,
    stockAlert: 3,
    lastUpdated: '2024-12-16T10:30:00Z',
  },

  // Nike Dunk Low Panda with multiple sizes
  {
    id: '2',
    productId: '302',
    productName: 'Nike Dunk Low "Panda"',
    variantName: 'Nike Dunk Low "Panda" - Size 9',
    sku: 'DUNK-PANDA-9',
    ean: 'DD1391-100-9',
    size: '9',
    color: 'White/Black',
    category: 'shoes',
    brand: 'Nike',
    price: 180.00,
    stockLevel: 8,
    stockAlert: 5,
    lastUpdated: '2024-12-16T09:15:00Z',
  },
  {
    id: '2b',
    productId: '302',
    productName: 'Nike Dunk Low "Panda"',
    variantName: 'Nike Dunk Low "Panda" - Size 10',
    sku: 'DUNK-PANDA-10',
    ean: 'DD1391-100-10',
    size: '10',
    color: 'White/Black',
    category: 'shoes',
    brand: 'Nike',
    price: 180.00,
    stockLevel: 12,
    stockAlert: 5,
    lastUpdated: '2024-12-16T09:15:00Z',
  },
  {
    id: '2c',
    productId: '302',
    productName: 'Nike Dunk Low "Panda"',
    variantName: 'Nike Dunk Low "Panda" - Size 11',
    sku: 'DUNK-PANDA-11',
    ean: 'DD1391-100-11',
    size: '11',
    color: 'White/Black',
    category: 'shoes',
    brand: 'Nike',
    price: 180.00,
    stockLevel: 0,
    stockAlert: 5,
    lastUpdated: '2024-12-16T09:15:00Z',
  },

  // Purple Brand Jeans with multiple waist sizes
  {
    id: '3',
    productId: '303',
    productName: 'Purple Brand P001 Skinny Jeans',
    variantName: 'Purple Brand P001 Skinny Jeans - 32x34',
    sku: 'P001-BLKR-32',
    ean: 'P001-BLKR222-32',
    size: '32x34',
    color: 'Black Raw',
    category: 'clothing',
    brand: 'Purple Brand',
    price: 190.00,
    stockLevel: 15,
    stockAlert: 8,
    lastUpdated: '2024-12-16T11:45:00Z',
  },
  {
    id: '3b',
    productId: '303',
    productName: 'Purple Brand P001 Skinny Jeans',
    variantName: 'Purple Brand P001 Skinny Jeans - 34x34',
    sku: 'P001-BLKR-34',
    ean: 'P001-BLKR222-34',
    size: '34x34',
    color: 'Black Raw',
    category: 'clothing',
    brand: 'Purple Brand',
    price: 190.00,
    stockLevel: 3,
    stockAlert: 8,
    lastUpdated: '2024-12-16T11:45:00Z',
  },
  {
    id: '3c',
    productId: '303',
    productName: 'Purple Brand P001 Skinny Jeans',
    variantName: 'Purple Brand P001 Skinny Jeans - 36x32',
    sku: 'P001-BLKR-36',
    ean: 'P001-BLKR222-36',
    size: '36x32',
    color: 'Black Raw',
    category: 'clothing',
    brand: 'Purple Brand',
    price: 190.00,
    stockLevel: 0,
    stockAlert: 8,
    lastUpdated: '2024-12-16T11:45:00Z',
  },

  // FOG Essentials Hoodie with clothing sizes
  {
    id: '4',
    productId: '304',
    productName: 'Fear of God Essentials Hoodie',
    variantName: 'Fear of God Essentials Hoodie - Large',
    sku: 'FOG-ESS-HOODIE-L',
    ean: 'FOG-ESS-BLK-L',
    size: 'L',
    color: 'Black',
    category: 'clothing',
    brand: 'Fear of God Essentials',
    price: 265.00,
    stockLevel: 22,
    stockAlert: 10,
    lastUpdated: '2024-12-16T08:20:00Z',
  },
  {
    id: '4b',
    productId: '304',
    productName: 'Fear of God Essentials Hoodie',
    variantName: 'Fear of God Essentials Hoodie - Medium',
    sku: 'FOG-ESS-HOODIE-M',
    ean: 'FOG-ESS-BLK-M',
    size: 'M',
    color: 'Black',
    category: 'clothing',
    brand: 'Fear of God Essentials',
    price: 265.00,
    stockLevel: 8,
    stockAlert: 10,
    lastUpdated: '2024-12-16T08:20:00Z',
  },
  {
    id: '4c',
    productId: '304',
    productName: 'Fear of God Essentials Hoodie',
    variantName: 'Fear of God Essentials Hoodie - Extra Large',
    sku: 'FOG-ESS-HOODIE-XL',
    ean: 'FOG-ESS-BLK-XL',
    size: 'XL',
    color: 'Black',
    category: 'clothing',
    brand: 'Fear of God Essentials',
    price: 265.00,
    stockLevel: 14,
    stockAlert: 10,
    lastUpdated: '2024-12-16T08:20:00Z',
  },

  // Running Shoes with half sizes
  {
    id: '5',
    productId: '305',
    productName: 'Nike Air Max 270',
    variantName: 'Nike Air Max 270 - Size 9.5',
    sku: 'AIRMAX270-9.5',
    ean: 'AM270-BLK-9.5',
    size: '9.5',
    color: 'Black/White',
    category: 'shoes',
    brand: 'Nike',
    price: 170.00,
    stockLevel: 7,
    stockAlert: 12,
    lastUpdated: '2024-12-16T14:30:00Z',
  },
  {
    id: '5b',
    productId: '305',
    productName: 'Nike Air Max 270',
    variantName: 'Nike Air Max 270 - Size 10.5',
    sku: 'AIRMAX270-10.5',
    ean: 'AM270-BLK-10.5',
    size: '10.5',
    color: 'Black/White',
    category: 'shoes',
    brand: 'Nike',
    price: 170.00,
    stockLevel: 11,
    stockAlert: 12,
    lastUpdated: '2024-12-16T14:30:00Z',
  },

  // Additional Purple Brand jeans with different sizes
  {
    id: '6',
    productId: '306',
    productName: 'Purple Brand P001 Light Indigo Vintage',
    variantName: 'Purple Brand P001 Light Indigo Vintage - 30x32',
    sku: 'P001-LIVI-30',
    ean: 'P001-LIVI122-30',
    size: '30x32',
    color: 'Light Indigo',
    category: 'clothing',
    brand: 'Purple Brand',
    price: 159.00,
    stockLevel: 4,
    stockAlert: 5,
    lastUpdated: '2024-12-16T13:15:00Z',
  },
  {
    id: '6b',
    productId: '306',
    productName: 'Purple Brand P001 Light Indigo Vintage',
    variantName: 'Purple Brand P001 Light Indigo Vintage - 32x32',
    sku: 'P001-LIVI-32',
    ean: 'P001-LIVI122-32',
    size: '32x32',
    color: 'Light Indigo',
    category: 'clothing',
    brand: 'Purple Brand',
    price: 159.00,
    stockLevel: 12,
    stockAlert: 5,
    lastUpdated: '2024-12-16T13:15:00Z',
  },

  // Classic T-Shirt with sizes
  {
    id: '7',
    productId: '307',
    productName: 'Essential Classic T-Shirt',
    variantName: 'Essential Classic T-Shirt - Small',
    sku: 'CLASSIC-TEE-S',
    ean: 'CLASSIC-TEE-WHT-S',
    size: 'S',
    color: 'White',
    category: 'clothing',
    brand: 'Essentials',
    price: 45.00,
    stockLevel: 25,
    stockAlert: 15,
    lastUpdated: '2024-12-16T12:00:00Z',
  },
  {
    id: '7b',
    productId: '307',
    productName: 'Essential Classic T-Shirt',
    variantName: 'Essential Classic T-Shirt - Medium',
    sku: 'CLASSIC-TEE-M',
    ean: 'CLASSIC-TEE-WHT-M',
    size: 'M',
    color: 'White',
    category: 'clothing',
    brand: 'Essentials',
    price: 45.00,
    stockLevel: 18,
    stockAlert: 15,
    lastUpdated: '2024-12-16T12:00:00Z',
  },
  {
    id: '7c',
    productId: '307',
    productName: 'Essential Classic T-Shirt',
    variantName: 'Essential Classic T-Shirt - Large',
    sku: 'CLASSIC-TEE-L',
    ean: 'CLASSIC-TEE-WHT-L',
    size: 'L',
    color: 'White',
    category: 'clothing',
    brand: 'Essentials',
    price: 45.00,
    stockLevel: 32,
    stockAlert: 15,
    lastUpdated: '2024-12-16T12:00:00Z',
  },

  // Nike Dunk High with more sizes
  {
    id: '8',
    productId: '308',
    productName: 'Nike Dunk High "Panda"',
    variantName: 'Nike Dunk High "Panda" - Size 8',
    sku: 'DUNK-HIGH-PANDA-8',
    ean: 'DD1869-103-8',
    size: '8',
    color: 'White/Black',
    category: 'shoes',
    brand: 'Nike',
    price: 170.00,
    stockLevel: 6,
    stockAlert: 8,
    lastUpdated: '2024-12-16T16:45:00Z',
  },
  {
    id: '8b',
    productId: '308',
    productName: 'Nike Dunk High "Panda"',
    variantName: 'Nike Dunk High "Panda" - Size 8.5',
    sku: 'DUNK-HIGH-PANDA-8.5',
    ean: 'DD1869-103-8.5',
    size: '8.5',
    color: 'White/Black',
    category: 'shoes',
    brand: 'Nike',
    price: 170.00,
    stockLevel: 9,
    stockAlert: 8,
    lastUpdated: '2024-12-16T16:45:00Z',
  },

  // Some accessories
  {
    id: '9',
    productId: '309',
    productName: 'New Era 59FIFTY Cap',
    variantName: 'New Era 59FIFTY Cap - One Size',
    sku: 'NE-59FIFTY-OS',
    ean: 'NE-59FIFTY-BLK',
    size: 'One Size',
    color: 'Black',
    category: 'accessories',
    brand: 'New Era',
    price: 85.00,
    stockLevel: 45,
    stockAlert: 20,
    lastUpdated: '2024-12-16T15:20:00Z',
  }
];

interface DemoInventoryDashboardProps {
  onStartDemo: () => void;
}

export function DemoInventoryDashboard({ onStartDemo }: DemoInventoryDashboardProps) {
  const [filters, setFilters] = useState<InventoryFilters>({
    sizes: [],
    categories: [],
    brands: [],
    inStock: false,
    lowStock: false,
    searchTerm: '',
  });

  const filteredInventory = mockInventoryData.filter(item => {
    // Size filter
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

  const stats = {
    totalItems: filteredInventory.length,
    totalValue: filteredInventory.reduce((sum, item) => sum + (item.price * item.stockLevel), 0),
    lowStockItems: filteredInventory.filter(item => item.stockLevel <= item.stockAlert).length,
    outOfStockItems: filteredInventory.filter(item => item.stockLevel === 0).length,
    categoriesCount: new Set(filteredInventory.map(item => item.category)).size,
  };

  const availableSizes = Array.from(new Set(mockInventoryData.map(item => item.size).filter(Boolean))).sort();
  const availableCategories = Array.from(new Set(mockInventoryData.map(item => item.category).filter(Boolean)));
  const availableBrands = Array.from(new Set(mockInventoryData.map(item => item.brand).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-primary text-primary-foreground px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <Play className="h-5 w-5" />
          <span className="font-medium">Demo Mode - Sample Data</span>
          <button
            onClick={onStartDemo}
            className="bg-primary-foreground text-primary px-4 py-1 rounded text-sm hover:bg-primary-foreground/90 transition-colors"
          >
            Connect Real API
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Inventory Dashboard
          </h1>
          <p className="text-muted-foreground">
            Demo with sample outlined.ca inventory data - Experience size-based filtering!
          </p>
        </div>

        {/* Stats */}
        <InventoryStatsComponent stats={stats} />

        {/* Quick Size Selector */}
        <div className="bg-card rounded-lg shadow border p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Size Filter - Try it! 🎯
          </h3>
          <SizeSelector
            availableSizes={availableSizes}
            selectedSizes={filters.sizes}
            onSizeSelect={(size) => {
              const newSizes = filters.sizes.includes(size)
                ? filters.sizes.filter(s => s !== size)
                : [...filters.sizes, size];
              setFilters(prev => ({ ...prev, sizes: newSizes }));
            }}
            onClearSizes={() => setFilters(prev => ({ ...prev, sizes: [] }))}
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg shadow border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, SKUs, or sizes..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10 pr-4 py-2 w-full border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Showing {filteredInventory.length} of {mockInventoryData.length} items
              </span>
            </div>
          </div>

          {/* Filters */}
          <InventoryFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            availableSizes={availableSizes}
            availableCategories={availableCategories}
            availableBrands={availableBrands}
          />
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.map((item) => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}