'use client';

import { Package, DollarSign, AlertTriangle, TrendingDown, Layers } from 'lucide-react';
import type { InventoryStats } from '@/types/lightspeed';

interface InventoryStatsProps {
  stats: InventoryStats;
}

export function InventoryStats({ stats }: InventoryStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    {
      title: 'Total Items',
      value: stats.totalItems.toLocaleString(),
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Low Stock',
      value: stats.lowStockItems.toLocaleString(),
      icon: TrendingDown,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockItems.toLocaleString(),
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
    {
      title: 'Categories',
      value: stats.categoriesCount.toLocaleString(),
      icon: Layers,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-6 transition-all hover:shadow-md transform hover:scale-105 animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor} mt-1 transition-all duration-300`}>
                  {stat.value}
                </p>
                {/* Trend indicator for demo */}
                {stat.title === 'Total Value' && (
                  <p className="text-xs text-green-600 mt-1">↗️ +12% this month</p>
                )}
                {stat.title === 'Total Items' && (
                  <p className="text-xs text-blue-600 mt-1">📦 17 unique variants</p>
                )}
              </div>
              <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-full transform transition-transform hover:rotate-12`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            
            {/* Progress indicators for relevant stats */}
            {stat.title === 'Low Stock' && stats.totalItems > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Alert Level</span>
                  <span>{((stats.lowStockItems / stats.totalItems) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (stats.lowStockItems / stats.totalItems) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
            
            {stat.title === 'Out of Stock' && stats.totalItems > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Out of Stock</span>
                  <span>{((stats.outOfStockItems / stats.totalItems) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (stats.outOfStockItems / stats.totalItems) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}