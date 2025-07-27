import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react';
import { InventoryStats } from '@/types/lightspeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InventoryStatsProps {
  stats: InventoryStats;
}

export function InventoryStatsComponent({ stats }: InventoryStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems.toLocaleString(),
      icon: Package,
      description: 'Inventory items',
      color: 'text-primary',
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      description: 'Inventory value',
      color: 'text-green-600',
    },
    {
      title: 'Low Stock',
      value: stats.lowStockItems.toString(),
      icon: AlertTriangle,
      description: 'Items need restocking',
      color: 'text-orange-600',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockItems.toString(),
      icon: TrendingUp,
      description: 'Items unavailable',
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}