import { InventoryItem, InventoryStats } from '@/types/lightspeed';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = window.location.origin;
  }

  async getInventory(size?: string): Promise<InventoryItem[]> {
    try {
      const url = new URL('/api/lightspeed/inventory', this.baseUrl);
      if (size) {
        url.searchParams.set('size', size);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw new Error('Failed to fetch inventory data');
    }
  }

  async getInventoryStats(): Promise<InventoryStats> {
    try {
      const response = await fetch(`${this.baseUrl}/api/lightspeed/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const stats = await response.json();
      return stats;
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      throw new Error('Failed to fetch inventory stats');
    }
  }
}

export const apiClient = new ApiClient();