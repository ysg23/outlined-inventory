'use client';

import { Package, AlertTriangle, TrendingDown, Star, Eye, ShoppingBag } from 'lucide-react';
import { InventoryItem } from '@/types/lightspeed';
import { motion } from 'framer-motion';

interface InventoryCardProps {
  item: InventoryItem;
  index?: number;
}

export function InventoryCard({ item, index = 0 }: InventoryCardProps) {
  const isLowStock = item.stockLevel <= item.stockAlert;
  const isOutOfStock = item.stockLevel === 0;

  const getStockStatus = () => {
    if (isOutOfStock) return { 
      text: 'Out of Stock', 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      border: 'border-red-200',
      gradient: 'from-red-500 to-red-600',
      dot: 'bg-red-500'
    };
    if (isLowStock) return { 
      text: 'Low Stock', 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      border: 'border-orange-200',
      gradient: 'from-orange-500 to-yellow-500',
      dot: 'bg-orange-500'
    };
    return { 
      text: 'In Stock', 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      border: 'border-green-200',
      gradient: 'from-green-500 to-emerald-500',
      dot: 'bg-green-500'
    };
  };

  const stockStatus = getStockStatus();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStockPercentage = () => {
    const maxStock = Math.max(item.stockAlert * 3, 10); // Assume max stock is 3x alert level or minimum 10
    return Math.min(100, (item.stockLevel / maxStock) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group card-elevated rounded-2xl overflow-hidden hover-lift bg-white"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {item.image ? (
          <motion.img
            src={item.image}
            alt={item.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-white/80 rounded-full p-4 shadow-lg">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        )}
        
        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${stockStatus.bg} ${stockStatus.color} ${stockStatus.border} shadow-sm`}>
            <div className={`w-2 h-2 rounded-full ${stockStatus.dot} animate-pulse`}></div>
            {isOutOfStock && <AlertTriangle className="h-3 w-3" />}
            {isLowStock && !isOutOfStock && <TrendingDown className="h-3 w-3" />}
            <span>{stockStatus.text}</span>
          </div>
        </div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
            >
              <Eye className="h-4 w-4 text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
            >
              <ShoppingBag className="h-4 w-4 text-gray-700" />
            </motion.button>
          </div>
        </div>

        {/* Quality indicator for high-value items */}
        {item.price > 200 && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-1.5 shadow-lg">
              <Star className="h-3 w-3 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors" title={item.productName}>
            {item.productName}
          </h3>
          {item.variantName && item.variantName !== item.productName && (
            <p className="text-sm text-gray-600 line-clamp-1 mt-1" title={item.variantName}>
              {item.variantName}
            </p>
          )}
          {item.brand && (
            <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">
              {item.brand}
            </p>
          )}
        </div>

        {/* Enhanced Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.size && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm">
              {item.size}
            </span>
          )}
          {item.color && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
              {item.color}
            </span>
          )}
          {item.category && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm">
              {item.category}
            </span>
          )}
        </div>

        {/* Price and Stock */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {formatPrice(item.price)}
            </span>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Stock Level</span>
              <span className={`font-bold text-lg ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                {item.stockLevel}
              </span>
            </div>
          </div>

          {/* Enhanced Stock Level Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Stock Health</span>
              <span>{Math.round(getStockPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getStockPercentage()}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full rounded-full bg-gradient-to-r ${stockStatus.gradient} shadow-sm`}
              />
            </div>
          </div>

          {/* Value calculation */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">Total Value</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(item.price * item.stockLevel)}
            </span>
          </div>
        </div>

        {/* SKU and EAN */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {item.sku && (
              <div className="space-y-1">
                <span className="text-gray-500 font-medium">SKU</span>
                <div className="font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded text-[10px]">
                  {item.sku}
                </div>
              </div>
            )}
            {item.ean && (
              <div className="space-y-1">
                <span className="text-gray-500 font-medium">EAN</span>
                <div className="font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded text-[10px]">
                  {item.ean}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-3 text-xs text-gray-400 flex items-center justify-between">
          <span>Updated {formatDate(item.lastUpdated)}</span>
          {item.stockLevel <= item.stockAlert && (
            <div className={`w-2 h-2 rounded-full ${stockStatus.dot} animate-pulse`}></div>
          )}
        </div>

        {/* Enhanced Alerts */}
        {isLowStock && !isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-xs font-semibold text-orange-800">Low Stock Alert</p>
                <p className="text-xs text-orange-700">Below threshold of {item.stockAlert} units</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Out of Stock Alert */}
        {isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs font-semibold text-red-800">Out of Stock</p>
                <p className="text-xs text-red-700">Immediate restocking required</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}