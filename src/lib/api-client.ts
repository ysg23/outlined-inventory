import { InventoryItem, InventoryStats } from '@/types/lightspeed';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = window.location.origin;
  }

  private getAuthHeaders(): HeadersInit {
    const accessToken = localStorage.getItem('lightspeed-access-token');
    const accountId = localStorage.getItem('lightspeed-account-id');

    if (!accessToken || !accountId) {
      throw new Error('Missing authentication credentials. Please log in again.');
    }

    return {
      'Authorization': `Bearer ${accessToken}`,
      'X-Account-ID': accountId,
      'Content-Type': 'application/json'
    };
  }

  async getInventory(size?: string): Promise<InventoryItem[]> {
    try {
      const url = new URL('/api/lightspeed/inventory', this.baseUrl);
      if (size) {
        url.searchParams.set('size', size);
      }

      console.log('Fetching inventory from:', url.toString());
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received inventory data:', data);
      return data.items || [];
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw new Error('Failed to fetch inventory data');
    }
  }

  async getInventoryStats(): Promise<InventoryStats> {
    try {
      const response = await fetch(`${this.baseUrl}/api/lightspeed/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
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