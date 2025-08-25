// API configuration for production/development
const getApiBaseUrl = () => {
  // Priority 1: Environment variable from build time (Coolify)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Priority 2: Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api';
  }
  
  // Priority 3: Production fallback (same domain)
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