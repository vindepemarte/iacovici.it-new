import React from 'react';
import { API_BASE_URL } from '../utils/api';

const EnvironmentDebug = () => {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_SITE_URL: process.env.REACT_APP_SITE_URL,
    REACT_APP_SOCIAL_GITHUB: process.env.REACT_APP_SOCIAL_GITHUB,
    REACT_APP_SOCIAL_LINKEDIN: process.env.REACT_APP_SOCIAL_LINKEDIN,
    REACT_APP_SOCIAL_TELEGRAM: process.env.REACT_APP_SOCIAL_TELEGRAM,
  };

  return (
    <div className=\"fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md z-50\">
      <h3 className=\"font-bold mb-2 text-yellow-400\">Environment Debug</h3>
      <div className=\"text-xs space-y-1\">
        <p><span className=\"font-semibold\">Current API URL:</span> {API_BASE_URL}</p>
        <hr className=\"border-gray-600 my-2\" />
        {Object.entries(envVars).map(([key, value]) => (
          <p key={key}>
            <span className=\"font-semibold text-blue-400\">{key}:</span> 
            <span className={value ? 'text-green-400' : 'text-red-400'}>
              {value || 'undefined'}
            </span>
          </p>
        ))}
        <hr className=\"border-gray-600 my-2\" />
        <p className=\"text-yellow-300\">
          <span className=\"font-semibold\">Build Time:</span> {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
};

export default EnvironmentDebug;