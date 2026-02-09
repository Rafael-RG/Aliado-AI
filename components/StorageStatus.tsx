import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

interface StorageStatusProps {
  className?: string;
}

const StorageStatus: React.FC<StorageStatusProps> = ({ className = "" }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const storageStatus = await dataService.getStorageStatus();
        setStatus(storageStatus);
      } catch (error) {
        console.error('Error checking storage status:', error);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-slate-200 rounded w-32"></div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className={`flex items-center gap-2 text-red-500 text-xs font-medium ${className}`}>
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <span>Backend no disponible</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${className}`}>
      <div className={`w-2 h-2 rounded-full ${status.isAzureStorage ? 'bg-green-500' : 'bg-amber-500'}`}></div>
      <span className={status.isAzureStorage ? 'text-green-600' : 'text-amber-600'}>
        {status.isAzureStorage ? '✅ Azure Storage' : '⚠️ In-Memory'}
      </span>
    </div>
  );
};

export default StorageStatus;