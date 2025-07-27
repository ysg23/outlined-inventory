'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InventoryFilters as Filters } from '@/types/lightspeed';

interface InventoryFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableSizes: string[];
  availableCategories: string[];
  availableBrands: string[];
}

export function InventoryFilters({
  filters,
  onFiltersChange,
  availableSizes,
  availableCategories,
  availableBrands,
}: InventoryFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      sizes: [],
      categories: [],
      brands: [],
      inStock: false,
      lowStock: false,
      searchTerm: '',
    });
  };

  const hasActiveFilters = filters.sizes.length > 0 || 
    filters.categories.length > 0 || 
    filters.brands.length > 0 || 
    filters.inStock || 
    filters.lowStock;

  return (
    <div className="mt-6 space-y-4">
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter('inStock', !filters.inStock)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.inStock
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          In Stock Only
        </button>
        <button
          onClick={() => updateFilter('lowStock', !filters.lowStock)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.lowStock
              ? 'bg-orange-100 text-orange-800 border border-orange-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Low Stock Alert
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span>Advanced Filters</span>
        {showAdvanced ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
          {/* Size Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Sizes</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableSizes.map((size) => (
                <label key={size} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size)}
                    onChange={() => toggleArrayFilter('sizes', size)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{size}</span>
                  <span className="text-xs text-gray-500">
                    ({availableSizes.filter(s => s === size).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
            <div className="space-y-2">
              {availableCategories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => toggleArrayFilter('categories', category)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleArrayFilter('brands', brand)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {filters.sizes.map((size) => (
            <span
              key={size}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
            >
              Size: {size}
              <button
                onClick={() => toggleArrayFilter('sizes', size)}
                className="hover:bg-blue-200 rounded-full"
              >
                ×
              </button>
            </span>
          ))}
          
          {filters.categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
            >
              {category}
              <button
                onClick={() => toggleArrayFilter('categories', category)}
                className="hover:bg-green-200 rounded-full"
              >
                ×
              </button>
            </span>
          ))}
          
          {filters.brands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
            >
              {brand}
              <button
                onClick={() => toggleArrayFilter('brands', brand)}
                className="hover:bg-purple-200 rounded-full"
              >
                ×
              </button>
            </span>
          ))}
          
          {filters.inStock && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
              In Stock
              <button
                onClick={() => updateFilter('inStock', false)}
                className="hover:bg-green-200 rounded-full"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.lowStock && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
              Low Stock
              <button
                onClick={() => updateFilter('lowStock', false)}
                className="hover:bg-orange-200 rounded-full"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}