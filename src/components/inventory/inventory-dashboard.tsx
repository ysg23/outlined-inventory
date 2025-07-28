import { useState, useEffect, useMemo } from 'react';
import { Search, Package, AlertTriangle } from 'lucide-react';
import { InventoryItem, InventoryFilters, InventoryStats } from '@/types/lightspeed';
import { apiClient } from '@/lib/api-client';
import { filterInventory } from '@/lib/inventory-utils';
import { InventoryCard } from './inventory-card';
import { InventoryFiltersComponent } from './inventory-filters';
import { InventoryStatsComponent } from './inventory-stats';
import { SizeSelector } from './size-selector';

interface InventoryDashboardProps {}

export function InventoryDashboard() {
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

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await apiClient.getInventory();
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
      const items = await apiClient.getInventory(size);
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
    return filterInventory(inventory, filters);
  }, [inventory, filters]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <h3 className="text-destructive font-semibold">Error Loading Inventory</h3>
              <p className="text-destructive/80 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={loadInventory}
            className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Inventory Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your inventory with advanced size and category filtering
          </p>
        </div>

        {/* Stats */}
        {stats && <InventoryStatsComponent stats={stats} />}

        {/* Quick Size Selector */}
        <div className="bg-card rounded-lg shadow border p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
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
                Showing {filteredInventory.length} of {inventory.length} items
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
        {filteredInventory.length === 0 ? (
          <div className="bg-card rounded-lg shadow border p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No items found
            </h3>
            <p className="text-muted-foreground">
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