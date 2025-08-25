import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context for runtime configuration
const RuntimeConfigContext = createContext();

// Hook to use runtime configuration
export const useRuntimeConfig = () => {
  const context = useContext(RuntimeConfigContext);
  if (!context) {
    throw new Error('useRuntimeConfig must be used within a RuntimeConfigProvider');
  }
  return context;
};

// Provider component
export const RuntimeConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    apiBaseUrl: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const discoverApiUrl = async () => {
      // First try the environment variable
      if (process.env.REACT_APP_API_URL) {
        console.log('✅ Using environment variable API URL:', process.env.REACT_APP_API_URL);
        setConfig({
          apiBaseUrl: process.env.REACT_APP_API_URL,
          isLoading: false,
          error: null
        });
        return;
      }

      // Runtime discovery for Coolify
      const currentHost = window.location.hostname;
      const currentProtocol = window.location.protocol;
      
      // List of possible backend URLs to try
      const possibleUrls = [
        // Coolify pattern: replace 'web' with 'backend' or similar
        `${currentProtocol}//${currentHost.replace(/^web[-.]?/, 'backend-')}/api`,
        `${currentProtocol}//${currentHost.replace(/^[^-]*/, 'backend')}/api`,
        // Same domain
        '/api',
        // Development fallback
        'http://localhost:3001/api'
      ];

      console.log('🔍 Trying to discover backend URL from:', possibleUrls);

      for (const url of possibleUrls) {
        try {
          console.log('🔄 Testing:', url);
          const response = await fetch(`${url}/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(5000) // 5 second timeout
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'OK') {
              console.log('✅ Found working backend at:', url);
              setConfig({
                apiBaseUrl: url.replace('/health', ''),
                isLoading: false,
                error: null
              });
              return;
            }
          }
        } catch (error) {
          console.log('❌ Failed to connect to:', url, error.message);
        }
      }

      // If all attempts failed
      console.error('❌ Could not discover backend URL');
      setConfig({
        apiBaseUrl: '/api', // Final fallback
        isLoading: false,
        error: 'Could not connect to backend'
      });
    };

    discoverApiUrl();
  }, []);

  return (
    <RuntimeConfigContext.Provider value={config}>
      {children}
    </RuntimeConfigContext.Provider>
  );
};

// Loading component
export const ConfigLoader = ({ children, fallback = null }) => {
  const { isLoading, error } = useRuntimeConfig();

  if (isLoading) {
    return fallback || (
      <div className=\"flex items-center justify-center min-h-screen\">
        <div className=\"text-center\">
          <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4\"></div>
          <p className=\"text-gray-600\">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=\"flex items-center justify-center min-h-screen\">
        <div className=\"text-center text-red-600\">
          <p className=\"mb-2\">⚠️ Backend Connection Error</p>
          <p className=\"text-sm text-gray-600\">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className=\"mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600\"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return children;
};