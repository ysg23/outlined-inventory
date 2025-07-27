'use client';

import { useState } from 'react';
import { X, Shirt, ShoppingBag, Grid3X3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeSelectorProps {
  availableSizes: string[];
  selectedSizes: string[];
  onSizeSelect: (size: string) => void;
  onClearSizes: () => void;
}

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const SHOE_SIZES = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'];

// Quick select popular sizes
const POPULAR_CLOTHING = ['S', 'M', 'L', 'XL'];
const POPULAR_SHOES = ['8', '9', '10', '11'];

export function SizeSelector({ availableSizes, selectedSizes, onSizeSelect, onClearSizes }: SizeSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'clothing' | 'shoes'>('all');

  const getFilteredSizes = () => {
    switch (activeCategory) {
      case 'clothing':
        return availableSizes.filter(size => 
          CLOTHING_SIZES.some(clothingSize => 
            size.toLowerCase() === clothingSize.toLowerCase()
          )
        );
      case 'shoes':
        return availableSizes.filter(size => 
          SHOE_SIZES.some(shoeSize => 
            size.toLowerCase() === shoeSize.toLowerCase()
          )
        );
      default:
        return availableSizes;
    }
  };

  const getPopularSizes = () => {
    switch (activeCategory) {
      case 'clothing':
        return POPULAR_CLOTHING.filter(size => availableSizes.includes(size));
      case 'shoes':
        return POPULAR_SHOES.filter(size => availableSizes.includes(size));
      default:
        return [...POPULAR_CLOTHING, ...POPULAR_SHOES].filter(size => availableSizes.includes(size));
    }
  };

  const filteredSizes = getFilteredSizes();
  const popularSizes = getPopularSizes();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'clothing': return Shirt;
      case 'shoes': return ShoppingBag;
      default: return Grid3X3;
    }
  };

  const getCategoryStats = (category: string) => {
    const sizes = getFilteredSizes();
    return sizes.length;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Category Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'all', label: 'All Sizes', icon: Grid3X3 },
          { key: 'clothing', label: 'Clothing', icon: Shirt },
          { key: 'shoes', label: 'Shoes', icon: ShoppingBag },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as any)}
            className={`relative flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeCategory === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeCategory === key 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {key === 'all' ? availableSizes.length : getCategoryStats(key)}
            </span>
          </button>
        ))}
      </div>

      {/* Quick Select Popular Sizes */}
      {popularSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Quick Select</h3>
            <span className="text-xs text-gray-500">Popular sizes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSizes.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSizeSelect(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                  }`}
                >
                  {size}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Sizes */}
      <AnimatePresence>
        {selectedSizes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Selected Sizes ({selectedSizes.length})
              </h3>
              <button
                onClick={onClearSizes}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
              >
                <X className="h-3 w-3" />
                <span>Clear All</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSizes.map((size) => (
                <motion.div
                  key={size}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg"
                >
                  <span>{size}</span>
                  <button
                    onClick={() => onSizeSelect(size)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Sizes Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            All {activeCategory === 'all' ? '' : activeCategory} Sizes
          </h3>
          <span className="text-xs text-gray-500">
            {filteredSizes.length} available
          </span>
        </div>
        
        {filteredSizes.length > 0 ? (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {filteredSizes.map((size) => {
              const isSelected = selectedSizes.includes(size);
              const isPopular = popularSizes.includes(size);
              
              return (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSizeSelect(size)}
                  className={`relative aspect-square flex items-center justify-center text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'
                  }`}
                >
                  {size}
                  {isPopular && !isSelected && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                  )}
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Grid3X3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No {activeCategory} sizes available</p>
          </div>
        )}
      </div>

      {/* Size Guide Hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 rounded-full p-1">
            <Grid3X3 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Size Selection Tip</h4>
            <p className="text-xs text-blue-700">
              Select multiple sizes to filter your inventory by specific size combinations. 
              Popular sizes are marked with an orange dot for quick identification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}