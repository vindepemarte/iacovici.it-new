// Global variable to store runtime-discovered API URL
let runtimeApiUrl = null;

// Function to set runtime API URL (called by RuntimeConfig)
export const setRuntimeApiUrl = (url) => {
  runtimeApiUrl = url;
  console.log('🔧 Runtime API URL set to:', url);
};

// API configuration for production/development
const getApiBaseUrl = () => {
  // Debug logging for environment variables
  console.log('🔍 Environment Debug Info:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  console.log('Runtime API URL:', runtimeApiUrl);
  console.log('All REACT_APP vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
  
  // Priority 1: Runtime discovered URL (most reliable for Coolify)
  if (runtimeApiUrl) {
    console.log('✅ Using runtime-discovered API URL:', runtimeApiUrl);
    return runtimeApiUrl;
  }
  
  // Priority 2: Environment variable from build time
  if (process.env.REACT_APP_API_URL) {
    console.log('✅ Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Priority 3: Development fallback
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Using development localhost URL');
    return 'http://localhost:3001/api';
  }
  
  // Priority 4: Try to detect if we're in Coolify by checking URL patterns
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  
  // If we're on a Coolify-like domain, try to construct backend URL
  if (currentHost.includes('.coolify.') || currentHost.includes('-') && !currentHost.includes('localhost')) {
    // Try to construct backend URL from current domain
    const backendUrl = `${currentProtocol}//${currentHost.replace(/^[^-]*/, 'backend')}/api`;
    console.log('🚀 Detected Coolify-like environment, using constructed backend URL:', backendUrl);
    return backendUrl;
  }
  
  // Final fallback (assumes backend is on same domain)
  console.log('⚠️ Using production fallback /api');
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};

// Template API functions
export const getTemplates = async () => {
  return await apiRequest('/templates');
};

export const getTemplateById = async (id) => {
  return await apiRequest(`/templates/${id}`);
};

export const trackTemplateDownload = async (templateId, email, ipAddress, downloadType) => {
  return await apiRequest('/templates/download', {
    method: 'POST',
    body: JSON.stringify({ templateId, email, ipAddress, downloadType }),
  });
};

// Blog API functions
export const getBlogPosts = async () => {
  return await apiRequest('/blog');
};

export const getBlogPostBySlug = async (slug) => {
  return await apiRequest(`/blog/${slug}`);
};

// Contact API functions
export const submitContactForm = async (formData) => {
  return await apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

// Auth API functions
export const login = async (email, password) => {
  return await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  return await apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ userId, currentPassword, newPassword }),
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
};

// Admin API functions
export const getDashboardStats = async () => {
  return await apiRequest('/admin/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const getDashboardAnalytics = async () => {
  return await apiRequest('/admin/dashboard/analytics', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const getAdminTemplates = async () => {
  return await apiRequest('/admin/templates', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const createOrUpdateTemplate = async (templateData) => {
  return await apiRequest('/admin/templates', {
    method: 'POST',
    body: JSON.stringify(templateData),
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
};

export const deleteTemplate = async (id) => {
  return await apiRequest(`/admin/templates/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const getAdminBlogPosts = async () => {
  return await apiRequest('/admin/blog-posts', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const createOrUpdateBlogPost = async (blogPostData) => {
  return await apiRequest('/admin/blog-posts', {
    method: 'POST',
    body: JSON.stringify(blogPostData),
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
};

export const deleteBlogPost = async (id) => {
  return await apiRequest(`/admin/blog-posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const getContactSubmissions = async () => {
  return await apiRequest('/admin/contacts', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Stripe API functions
export const createCheckoutSession = async (templateId, email) => {
  return await apiRequest('/payments/create-checkout', {
    method: 'POST',
    body: JSON.stringify({ templateId, email }),
  });
};

export const verifyPaymentSuccess = async (sessionId) => {
  return await apiRequest(`/payments/success?session_id=${sessionId}`);
};

// Site Settings API functions
export const getPublicSettings = async () => {
  return await apiRequest('/settings/public');
};

export const getSiteSettings = async () => {
  return await apiRequest('/settings', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const updateSiteSetting = async (key, value, type = 'string', isPublic = true, description) => {
  return await apiRequest(`/settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value, type, isPublic, description }),
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
};

export const bulkUpdateSettings = async (settings) => {
  return await apiRequest('/settings', {
    method: 'PUT',
    body: JSON.stringify({ settings }),
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
};

export const deleteSiteSetting = async (key) => {
  return await apiRequest(`/settings/${key}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Export the API_BASE_URL for use in other modules
export { API_BASE_URL };