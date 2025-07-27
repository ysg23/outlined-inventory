import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InventoryFilters } from '@/types/lightspeed';
import { X } from 'lucide-react';

interface InventoryFiltersProps {
  filters: InventoryFilters;
  onFiltersChange: (filters: InventoryFilters) => void;
  availableSizes: string[];
  availableCategories: string[];
  availableBrands: string[];
}

export function InventoryFiltersComponent({ 
  filters, 
  onFiltersChange, 
  availableSizes, 
  availableCategories, 
  availableBrands 
}: InventoryFiltersProps) {
  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: newBrands });
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
                          filters.lowStock ||
                          filters.searchTerm.length > 0;

  return (
    <div className="mt-6 space-y-4">
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">Active filters:</span>
          {filters.sizes.map(size => (
            <Badge key={size} variant="secondary" className="cursor-pointer" onClick={() => toggleSize(size)}>
              Size {size} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.categories.map(category => (
            <Badge key={category} variant="secondary" className="cursor-pointer capitalize" onClick={() => toggleCategory(category)}>
              {category} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.brands.map(brand => (
            <Badge key={brand} variant="secondary" className="cursor-pointer" onClick={() => toggleBrand(brand)}>
              {brand} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.inStock && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onFiltersChange({ ...filters, inStock: false })}>
              In Stock <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {filters.lowStock && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onFiltersChange({ ...filters, lowStock: false })}>
              Low Stock <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sizes */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Sizes</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {availableSizes.map(size => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={filters.sizes.includes(size)}
                  onCheckedChange={() => toggleSize(size)}
                />
                <label 
                  htmlFor={`size-${size}`} 
                  className="text-sm text-foreground cursor-pointer"
                >
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Categories</h4>
          <div className="space-y-2">
            {availableCategories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <label 
                  htmlFor={`category-${category}`} 
                  className="text-sm text-foreground cursor-pointer capitalize"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Brands</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {availableBrands.filter(Boolean).map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <label 
                  htmlFor={`brand-${brand}`} 
                  className="text-sm text-foreground cursor-pointer"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Status */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Stock Status</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, inStock: checked as boolean })
                }
              />
              <label htmlFor="in-stock" className="text-sm text-foreground cursor-pointer">
                In Stock Only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="low-stock"
                checked={filters.lowStock}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, lowStock: checked as boolean })
                }
              />
              <label htmlFor="low-stock" className="text-sm text-foreground cursor-pointer">
                Low Stock Alert
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}