'use client';

import { useState } from 'react';
import { InventoryItem, InventoryFilters } from '@/types/lightspeed';
import { InventoryCard } from './inventory-card';
import { InventoryFilters as FiltersComponent } from './inventory-filters';
import { InventoryStats } from './inventory-stats';
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
    image: 'https://cdn.shopify.com/s/files/1/0644/6289/7303/files/Nike_Kobe_6_Protro_Total_Orange_IH1871-800_01.jpg?v=1720439842',
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
    image: 'https://cdn.shopify.com/s/files/1/0644/6289/7303/files/Nike_Kobe_6_Protro_Total_Orange_IH1871-800_01.jpg?v=1720439842',
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
    image: 'https://cdn.shopify.com/s/files/1/0644/6289/7303/files/Nike_Kobe_6_Protro_Total_Orange_IH1871-800_01.jpg?v=1720439842',
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
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
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
    image: 'https://purple-brand.com/cdn/shop/files/P001BlackRaw_1_400x.jpg?v=1689798154',
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
    image: 'https://purple-brand.com/cdn/shop/files/P001BlackRaw_1_400x.jpg?v=1689798154',
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
    image: 'https://purple-brand.com/cdn/shop/files/P001BlackRaw_1_400x.jpg?v=1689798154',
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
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
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
    image: 'https://purple-brand.com/cdn/shop/files/P001LightIndigoVintage_1_400x.jpg?v=1689798154',
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
    image: 'https://purple-brand.com/cdn/shop/files/P001LightIndigoVintage_1_400x.jpg?v=1689798154',
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
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80d2b0048?w=400&h=400&fit=crop',
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
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const guideSteps = [
    {
      title: "Size-Based Filtering Magic! 🎯",
      description: "Click any size below to instantly see all items in that size across your entire store. Try clicking 'L' to see all Large items!",
      target: "size-selector",
      highlight: true
    },
    {
      title: "Smart Search by Size 🔍",
      description: "Search for 'large' or 'size 10' to find all matching items. Much faster than clicking through individual products!",
      target: "search-bar",
      highlight: true
    },
    {
      title: "Low Stock Alerts 📊",
      description: "Red and orange items are low stock or out of stock. Click 'Low Stock Alert' to see which sizes need restocking.",
      target: "filters",
      highlight: true
    },
    {
      title: "Real Business Value 💡",
      description: "Instead of 'T-Shirt: 50 units', you now see 'Large: 45, Medium: 12, Small: 3'. Make size-based decisions instantly!",
      target: "inventory-grid",
      highlight: false
    }
  ];

  const startGuide = () => {
    setShowGuide(true);
    setGuideStep(0);
  };

  const nextStep = () => {
    if (guideStep < guideSteps.length - 1) {
      setGuideStep(guideStep + 1);
    } else {
      setShowGuide(false);
      setGuideStep(0);
    }
  };

  const skipGuide = () => {
    setShowGuide(false);
    setGuideStep(0);
  };

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

  const availableSizes = Array.from(new Set(mockInventoryData.map(item => item.size).filter((size): size is string => size !== undefined))).sort();
  const availableCategories = Array.from(new Set(mockInventoryData.map(item => item.category).filter((category): category is string => category !== undefined)));
  const availableBrands = Array.from(new Set(mockInventoryData.map(item => item.brand).filter((brand): brand is string => brand !== undefined)));

  const loadInventoryBySize = (size: string) => {
    setFilters(prev => ({ ...prev, sizes: [size] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🔥 Live Demo - Real Outlined.ca Inventory</h2>
              <p className="text-blue-100 mb-4">
                Experience size-based filtering with <strong>real streetwear products</strong> from outlined.ca. 
                See how easily you can filter Nike Kobes by size 9, 10, 11 or Purple Brand jeans by waist size!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-bold text-lg">17</div>
                  <div>Real Products</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-bold text-lg">Nike, FOG</div>
                  <div>Premium Brands</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-bold text-lg">$550</div>
                  <div>Kobe 6 Protro</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-bold text-lg">$3.4K</div>
                  <div>Total Value</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={onStartDemo}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Connect Real API</span>
              </button>
              <button
                onClick={startGuide}
                className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-sm"
              >
                🎯 Demo Walkthrough
              </button>
            </div>
          </div>
          
          {/* Quick Demo Tips */}
          <div className="mt-6 bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🚀 Demo Highlights - Try These:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>👟 Size Filtering:</strong> Click "9" to see all size 9 sneakers (Kobe 6 + Dunk Low)
              </div>
              <div>
                <strong>👕 Clothing Sizes:</strong> Click "L" to see all Large items (FOG hoodies, Purple Brand tees)
              </div>
              <div>
                <strong>🔍 Brand Search:</strong> Search "Purple Brand" or "FOG" to see brand-specific inventory
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inventory Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your inventory with advanced size and category filtering
          </p>
        </div>

        {/* Stats */}
        <InventoryStats stats={stats} />

        {/* Quick Size Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Size Filter
          </h3>
          <SizeSelector
            availableSizes={availableSizes}
            selectedSizes={filters.sizes}
            onSizeSelect={loadInventoryBySize}
            onClearSizes={() => setFilters(prev => ({ ...prev, sizes: [] }))}
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, SKUs, or sizes..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Showing {filteredInventory.length} of {mockInventoryData.length} items
              </span>
            </div>
          </div>

          {/* Filters */}
          <FiltersComponent
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