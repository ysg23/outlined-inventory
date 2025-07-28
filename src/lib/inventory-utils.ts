import { InventoryItem, InventoryFilters } from '@/types/lightspeed';

export function filterInventory(items: InventoryItem[], filters: InventoryFilters): InventoryItem[] {
  return items.filter(item => {
    // Size filter
    if (filters.sizes.length > 0 && !filters.sizes.some(size => 
      item.size?.toLowerCase().includes(size.toLowerCase())
    )) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
      return false;
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(item.brand || '')) {
      return false;
    }

    // Stock status filters
    if (filters.inStock && item.stockLevel === 0) {
      return false;
    }

    if (filters.lowStock && item.stockLevel >= 5) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        item.productName.toLowerCase().includes(searchLower) ||
        item.variantName.toLowerCase().includes(searchLower) ||
        item.sku.toLowerCase().includes(searchLower) ||
        item.size?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });
}