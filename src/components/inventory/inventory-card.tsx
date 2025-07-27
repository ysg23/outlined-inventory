import { AlertTriangle, Package, Tag, TrendingDown } from 'lucide-react';
import { InventoryItem } from '@/types/lightspeed';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface InventoryCardProps {
  item: InventoryItem;
}

export function InventoryCard({ item }: InventoryCardProps) {
  const isLowStock = item.stockLevel <= item.stockAlert;
  const isOutOfStock = item.stockLevel === 0;

  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', variant: 'destructive' as const };
    if (isLowStock) return { text: 'Low Stock', variant: 'secondary' as const };
    return { text: 'In Stock', variant: 'default' as const };
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
              {item.productName}
            </h3>
            {item.variantName !== item.productName && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                {item.variantName}
              </p>
            )}
          </div>
          <Badge variant={stockStatus.variant} className="ml-2 flex-shrink-0">
            {stockStatus.text}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Size and Color */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.size && (
            <Badge variant="outline" className="text-xs">
              Size {item.size}
            </Badge>
          )}
          {item.color && (
            <Badge variant="outline" className="text-xs">
              {item.color}
            </Badge>
          )}
          {item.category && (
            <Badge variant="outline" className="text-xs capitalize">
              {item.category}
            </Badge>
          )}
        </div>

        {/* Price and Stock */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              ${item.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-sm">
              <Package className="h-3 w-3" />
              <span className={`font-medium ${
                isOutOfStock ? 'text-destructive' : 
                isLowStock ? 'text-warning' : 
                'text-muted-foreground'
              }`}>
                {item.stockLevel} units
              </span>
            </div>
          </div>

          {/* Stock Alert */}
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center gap-1 text-xs text-warning">
              <AlertTriangle className="h-3 w-3" />
              <span>Alert level: {item.stockAlert}</span>
            </div>
          )}

          {/* SKU and EAN */}
          <div className="text-xs text-muted-foreground space-y-1">
            {item.sku && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>SKU: {item.sku}</span>
              </div>
            )}
            {item.ean && (
              <div className="flex items-center gap-1">
                <span>EAN: {item.ean}</span>
              </div>
            )}
          </div>

          {/* Total Value */}
          <div className="pt-1 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Value:</span>
              <span className="font-medium text-foreground">
                ${(item.price * item.stockLevel).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}