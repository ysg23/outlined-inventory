'use client';

import { useState, useEffect } from 'react';
import { LightspeedCredentials } from '@/types/lightspeed';
import { InventoryDashboard } from '@/components/inventory/inventory-dashboard';
import { ApiSetup } from '@/components/inventory/api-setup';

export default function InventoryPage() {
  const [credentials, setCredentials] = useState<LightspeedCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved credentials from localStorage
    const savedCredentials = localStorage.getItem('lightspeed-credentials');
    if (savedCredentials) {
      try {
        setCredentials(JSON.parse(savedCredentials));
      } catch (error) {
        console.error('Failed to parse saved credentials:', error);
        localStorage.removeItem('lightspeed-credentials');
      }
    }
    setIsLoading(false);
  }, []);

  const handleCredentialsSubmit = (newCredentials: LightspeedCredentials) => {
    setCredentials(newCredentials);
    // Save credentials to localStorage
    localStorage.setItem('lightspeed-credentials', JSON.stringify(newCredentials));
  };

  const handleDisconnect = () => {
    setCredentials(null);
    localStorage.removeItem('lightspeed-credentials');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!credentials) {
    return <ApiSetup onCredentialsSubmit={handleCredentialsSubmit} />;
  }

  return (
    <div className="relative">
      {/* Disconnect Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleDisconnect}
          className="bg-white shadow-md border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Disconnect API
        </button>
      </div>
      
      <InventoryDashboard credentials={credentials} />
    </div>
  );
}