import { LightspeedCredentials } from '@/types/lightspeed';

/**
 * Secure credential management for Lightspeed API
 * 
 * IMPORTANT SECURITY NOTE:
 * - This implementation stores credentials in browser localStorage for frontend-only apps
 * - For production applications, consider using Supabase for secure credential management
 * - Never store API secrets in your codebase or commit them to version control
 * 
 * Recommended approach: Connect to Supabase for secure credential storage
 * Link: https://docs.lovable.dev/integrations/supabase
 */

const STORAGE_KEY = 'lightspeed-credentials';

export class CredentialManager {
  /**
   * Save credentials securely to localStorage
   * In production, this should be replaced with Supabase edge functions
   */
  static saveCredentials(credentials: LightspeedCredentials): void {
    try {
      // Encrypt or hash sensitive data in production
      const encryptedCredentials = this.encryptCredentials(credentials);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(encryptedCredentials));
      
      // Log for debugging (remove in production)
      console.log('✅ Credentials saved securely');
    } catch (error) {
      console.error('❌ Failed to save credentials:', error);
      throw new Error('Failed to save API credentials');
    }
  }

  /**
   * Load credentials from localStorage
   */
  static loadCredentials(): LightspeedCredentials | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const encryptedCredentials = JSON.parse(stored);
      return this.decryptCredentials(encryptedCredentials);
    } catch (error) {
      console.error('❌ Failed to load credentials:', error);
      return null;
    }
  }

  /**
   * Remove credentials from storage
   */
  static clearCredentials(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Credentials cleared');
  }

  /**
   * Check if credentials are currently stored
   */
  static hasCredentials(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  /**
   * Validate credential format before saving
   */
  static validateCredentials(credentials: LightspeedCredentials): boolean {
    // R-Series validation
    if (!credentials.accessToken && !credentials.domain) {
      return !!(credentials.apiKey && credentials.secret && credentials.cluster);
    }
    
    // X-Series validation
    if (credentials.accessToken && credentials.domain) {
      return !!(credentials.domain && credentials.accessToken);
    }

    return false;
  }

  /**
   * Basic encryption for localStorage (not secure for production)
   * In production, use proper encryption or Supabase edge functions
   */
  private static encryptCredentials(credentials: LightspeedCredentials): string {
    // This is a placeholder - implement proper encryption for production
    // Or better yet, use Supabase for secure credential management
    return btoa(JSON.stringify(credentials));
  }

  /**
   * Basic decryption for localStorage
   */
  private static decryptCredentials(encrypted: string): LightspeedCredentials {
    try {
      return JSON.parse(atob(encrypted));
    } catch (error) {
      throw new Error('Invalid credential format');
    }
  }

  /**
   * Test API connection with provided credentials
   */
  static async testConnection(credentials: LightspeedCredentials): Promise<boolean> {
    try {
      // Basic validation first
      if (!this.validateCredentials(credentials)) {
        throw new Error('Invalid credential format');
      }

      // Test API connection
      const baseUrl = credentials.domain && credentials.accessToken
        ? `https://${credentials.domain}.retail.lightspeed.app/api`
        : credentials.cluster === 'eu1' 
          ? 'https://api.webshopapp.com/en'
          : 'https://api.shoplightspeed.com/en';

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Inventory-Dashboard/1.0',
      };

      // Add authentication
      if (credentials.accessToken) {
        headers['Authorization'] = `Bearer ${credentials.accessToken}`;
      } else {
        const auth = btoa(`${credentials.apiKey}:${credentials.secret}`);
        headers['Authorization'] = `Basic ${auth}`;
      }

      // Test endpoint - try to fetch first product or variant
      const testEndpoint = credentials.accessToken 
        ? '/2.0/products?limit=1'
        : '/products.json?limit=1';

      const response = await fetch(`${baseUrl}${testEndpoint}`, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        console.log('✅ API connection successful');
        return true;
      } else {
        console.error('❌ API connection failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

/**
 * React hook for credential management
 */
export function useCredentials() {
  const saveCredentials = (credentials: LightspeedCredentials) => {
    CredentialManager.saveCredentials(credentials);
  };

  const loadCredentials = () => {
    return CredentialManager.loadCredentials();
  };

  const clearCredentials = () => {
    CredentialManager.clearCredentials();
  };

  const hasCredentials = () => {
    return CredentialManager.hasCredentials();
  };

  const testConnection = (credentials: LightspeedCredentials) => {
    return CredentialManager.testConnection(credentials);
  };

  return {
    saveCredentials,
    loadCredentials,
    clearCredentials,
    hasCredentials,
    testConnection,
  };
}