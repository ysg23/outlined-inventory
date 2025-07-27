import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SizeSelectorProps {
  availableSizes: string[];
  selectedSizes: string[];
  onSizeSelect: (size: string) => void;
  onClearSizes: () => void;
}

export function SizeSelector({ 
  availableSizes, 
  selectedSizes, 
  onSizeSelect, 
  onClearSizes 
}: SizeSelectorProps) {
  // Group sizes by type
  const clothingSizes = availableSizes.filter(size => 
    ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'].includes(size.toUpperCase())
  );

  const pantsSizes = availableSizes.filter(size => 
    size.includes('x') && size.match(/\d+x\d+/)
  );

  const shoeSizes = availableSizes.filter(size => 
    !clothingSizes.includes(size) && 
    !pantsSizes.includes(size) && 
    (size.match(/^\d+(\.\d+)?$/) || size === 'One Size')
  );

  const renderSizeGroup = (title: string, sizes: string[]) => {
    if (sizes.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => onSizeSelect(size)}
              className="h-8"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Selected Sizes */}
      {selectedSizes.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">Selected:</span>
          {selectedSizes.map(size => (
            <Badge key={size} variant="secondary" className="cursor-pointer">
              Size {size}
              <X 
                className="h-3 w-3 ml-1" 
                onClick={() => onSizeSelect(size)}
              />
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearSizes}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Size Groups */}
      <div className="space-y-4">
        {renderSizeGroup('Clothing', clothingSizes)}
        {renderSizeGroup('Pants', pantsSizes)}
        {renderSizeGroup('Shoes', shoeSizes)}
        
        {/* Other sizes */}
        {availableSizes.filter(size => 
          !clothingSizes.includes(size) && 
          !pantsSizes.includes(size) && 
          !shoeSizes.includes(size)
        ).length > 0 && renderSizeGroup(
          'Other', 
          availableSizes.filter(size => 
            !clothingSizes.includes(size) && 
            !pantsSizes.includes(size) && 
            !shoeSizes.includes(size)
          )
        )}
      </div>

      {availableSizes.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No sizes available in current inventory
        </p>
      )}
    </div>
  );
}
