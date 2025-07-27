'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Package, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { InventoryItem, InventoryFilters, InventoryStats, LightspeedCredentials } from '@/types/lightspeed';
import { LightspeedAPI } from '@/lib/lightspeed-api';
import { InventoryCard } from './inventory-card';
import { InventoryFilters as FiltersComponent } from './inventory-filters';
import { InventoryStats as StatsComponent } from './inventory-stats';
import { SizeSelector } from './size-selector';

interface InventoryDashboardProps {
  credentials: LightspeedCredentials;
}

export function InventoryDashboard({ credentials }: InventoryDashboardProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>({
    sizes: [],
    categories: [],
    brands: [],
    inStock: false,
    lowStock: false,
    searchTerm: '',
  });

  const api = useMemo(() => new LightspeedAPI(credentials), [credentials]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await api.getAllInventory();
      setInventory(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryBySize = async (size: string) => {
    try {
      setLoading(true);
      setError(null);
      const items = await api.getInventoryBySize(size);
      setInventory(items);
      setFilters(prev => ({ ...prev, sizes: [size] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory by size');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredInventory = useMemo(() => {
    return api.filterInventory(inventory, filters);
  }, [inventory, filters, api]);

  const stats = useMemo(() => {
    if (filteredInventory.length === 0) return null;
    
    const totalValue = filteredInventory.reduce((sum, item) => sum + (item.price * item.stockLevel), 0);
    const lowStockItems = filteredInventory.filter(item => item.stockLevel <= item.stockAlert).length;
    const outOfStockItems = filteredInventory.filter(item => item.stockLevel === 0).length;
    const categories = new Set(filteredInventory.map(item => item.category)).size;

    return {
      totalItems: filteredInventory.length,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categoriesCount: categories,
    };
  }, [filteredInventory]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    inventory.forEach(item => {
      if (item.size) {
        sizes.add(item.size);
      }
    });
    return Array.from(sizes).sort();
  }, [inventory]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    inventory.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories);
  }, [inventory]);

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    inventory.forEach(item => {
      if (item.brand) {
        brands.add(item.brand);
      }
    });
    return Array.from(brands);
  }, [inventory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Inventory</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={loadInventory}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        {stats && <StatsComponent stats={stats} />}

        {/* Quick Size Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Size Filter
          </h3>
          <SizeSelector
            availableSizes={availableSizes}
            selectedSizes={filters.sizes}
            onSizeSelect={(size) => loadInventoryBySize(size)}
            onClearSizes={() => {
              setFilters(prev => ({ ...prev, sizes: [] }));
              loadInventory();
            }}
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
                Showing {filteredInventory.length} of {inventory.length} items
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
        {filteredInventory.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInventory.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}