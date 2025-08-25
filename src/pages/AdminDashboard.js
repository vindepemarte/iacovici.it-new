import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Calendar,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  BarChart2,
  TrendingUp,
  Package,
  UserPlus,
  Key,
  Lock,
  Save,
  AlertCircle,
  CheckCircle,
  Loader,
  Globe,
  Mail,
  Phone
} from 'lucide-react';
import { 
  getDashboardStats, 
  getDashboardAnalytics,
  getAdminTemplates, 
  getAdminBlogPosts, 
  getContactSubmissions,
  changePassword,
  getSiteSettings,
  bulkUpdateSettings,
  createOrUpdateTemplate,
  deleteTemplate,
  createOrUpdateBlogPost,
  deleteBlogPost
} from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Dashboard data state
  const [stats, setStats] = useState({
    totalTemplates: 0,
    totalBlogPosts: 0,
    recentContacts: 0,
    totalDownloads: 0
  });
  const [analytics, setAnalytics] = useState({
    downloadStats: [],
    downloadsByDate: [],
    topCategories: [],
    contactStats: []
  });
  const [templates, setTemplates] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [leads, setLeads] = useState([]);
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Site settings state
  const [siteSettings, setSiteSettings] = useState([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  // API Key management state
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loadingApiKey, setLoadingApiKey] = useState(false);
  
  // CRUD Modal states
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingBlogPost, setEditingBlogPost] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: null, id: null, title: '' });
  
  // Form data states
  const [templateForm, setTemplateForm] = useState({
    title: '',
    description: '',
    category: '',
    iconName: 'workflow',
    isPro: false,
    price: '',
    tutorialLink: '',
    workflowData: '',
    seoTitle: '',
    seoDescription: ''
  });
  
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Admin',
    tags: '',
    featuredImage: '',
    isPublished: false,
    seoTitle: '',
    seoDescription: ''
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [templatesData, blogPostsData, contactsData] = await Promise.all([
          getAdminTemplates().catch(() => []),
          getAdminBlogPosts().catch(() => []),
          getContactSubmissions().catch(() => [])
        ]);
        
        setTemplates(templatesData);
        setBlogPosts(blogPostsData);
        setLeads(contactsData);
        
        // Calculate stats
        const totalDownloads = templatesData.reduce((sum, template) => 
          sum + parseInt(template.download_count || 0), 0
        );
        
        setStats({
          totalTemplates: templatesData.length,
          totalBlogPosts: blogPostsData.length,
          recentContacts: contactsData.filter(contact => {
            const contactDate = new Date(contact.created_at);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return contactDate > weekAgo;
          }).length,
          totalDownloads
        });
        
        // Set analytics data
        setAnalytics({
          downloadStats: templatesData,
          downloadsByDate: [],
          topCategories: [...new Set(templatesData.map(t => t.category))]
            .map(category => ({
              category,
              count: templatesData.filter(t => t.category === category).length
            })),
          contactStats: contactsData
        });
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch API key and site settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch API key (placeholder for now)
        setApiKey('iak_live_********************************');
        
        // Fetch site settings
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);
  
  // Password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }
    
    try {
      await changePassword(1, passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveStatus({ type: 'success', message: 'Password changed successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Site settings save handler
  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    try {
      await bulkUpdateSettings(siteSettings.map(setting => ({
        key: setting.setting_key,
        value: setting.setting_value,
        type: setting.setting_type,
        isPublic: setting.is_public,
        description: setting.description
      })));
      setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Failed to save settings: ' + err.message });
    } finally {
      setSettingsLoading(false);
    }
  };
  
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const regenerateApiKey = async () => {
    setLoadingApiKey(true);
    try {
      // This would be an API call to regenerate the API key
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newKey = 'iak_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApiKey(newKey);
      setSaveStatus({ type: 'success', message: 'API key regenerated successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Error regenerating API key:', err);
      setSaveStatus({ type: 'error', message: 'Failed to regenerate API key' });
    } finally {
      setLoadingApiKey(false);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setSaveStatus({ type: 'success', message: 'API key copied to clipboard!' });
    setTimeout(() => setSaveStatus(null), 2000);
  };
  
  // CRUD handlers for templates
  const handleCreateTemplate = () => {
    setTemplateForm({
      title: '',
      description: '',
      category: '',
      iconName: 'workflow',
      isPro: false,
      price: '',
      tutorialLink: '',
      workflowData: '',
      seoTitle: '',
      seoDescription: ''
    });
    setEditingTemplate(null);
    setShowTemplateModal(true);
  };
  
  const handleEditTemplate = (template) => {
    setTemplateForm({
      title: template.title || '',
      description: template.description || '',
      category: template.category || '',
      iconName: template.icon_name || 'workflow',
      isPro: template.is_pro || false,
      price: template.price || '',
      tutorialLink: template.tutorial_link || '',
      workflowData: typeof template.workflow_data_json === 'string' 
        ? template.workflow_data_json 
        : JSON.stringify(template.workflow_data_json, null, 2),
      seoTitle: template.seo_title || '',
      seoDescription: template.seo_description || ''
    });
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };
  
  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let workflowData;
      try {
        workflowData = JSON.parse(templateForm.workflowData);
      } catch (err) {
        setSaveStatus({ type: 'error', message: 'Invalid JSON in workflow data' });
        setLoading(false);
        return;
      }
      
      const templateData = {
        id: editingTemplate?.id,
        title: templateForm.title,
        description: templateForm.description,
        category: templateForm.category,
        iconName: templateForm.iconName,
        isPro: templateForm.isPro,
        price: templateForm.isPro ? parseFloat(templateForm.price) || 0 : 0,
        tutorialLink: templateForm.tutorialLink,
        workflowData: workflowData,
        seoTitle: templateForm.seoTitle,
        seoDescription: templateForm.seoDescription
      };
      
      await createOrUpdateTemplate(templateData);
      
      // Refresh templates list
      const updatedTemplates = await getAdminTemplates();
      setTemplates(updatedTemplates);
      
      setShowTemplateModal(false);
      setSaveStatus({ 
        type: 'success', 
        message: `Template ${editingTemplate ? 'updated' : 'created'} successfully!` 
      });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({ type: 'error', message: `Failed to save template: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTemplate = (template) => {
    setDeleteConfirm({
      show: true,
      type: 'template',
      id: template.id,
      title: template.title
    });
  };
  
  // CRUD handlers for blog posts
  const handleCreateBlogPost = () => {
    setBlogForm({
      title: '',
      content: '',
      excerpt: '',
      author: 'Admin',
      tags: '',
      featuredImage: '',
      isPublished: false,
      seoTitle: '',
      seoDescription: ''
    });
    setEditingBlogPost(null);
    setShowBlogModal(true);
  };
  
  const handleEditBlogPost = (post) => {
    setBlogForm({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      author: post.author || 'Admin',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      featuredImage: post.featured_image || '',
      isPublished: post.is_published || false,
      seoTitle: post.seo_title || '',
      seoDescription: post.seo_description || ''
    });
    setEditingBlogPost(post);
    setShowBlogModal(true);
  };
  
  const handleSaveBlogPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const blogData = {
        id: editingBlogPost?.id,
        title: blogForm.title,
        content: blogForm.content,
        excerpt: blogForm.excerpt,
        author: blogForm.author,
        tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featuredImage: blogForm.featuredImage,
        isPublished: blogForm.isPublished,
        seoTitle: blogForm.seoTitle,
        seoDescription: blogForm.seoDescription
      };
      
      await createOrUpdateBlogPost(blogData);
      
      // Refresh blog posts list
      const updatedPosts = await getAdminBlogPosts();
      setBlogPosts(updatedPosts);
      
      setShowBlogModal(false);
      setSaveStatus({ 
        type: 'success', 
        message: `Blog post ${editingBlogPost ? 'updated' : 'created'} successfully!` 
      });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({ type: 'error', message: `Failed to save blog post: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteBlogPost = (post) => {
    setDeleteConfirm({
      show: true,
      type: 'blog',
      id: post.id,
      title: post.title
    });
  };
  
  const confirmDelete = async () => {
    setLoading(true);
    
    try {
      if (deleteConfirm.type === 'template') {
        await deleteTemplate(deleteConfirm.id);
        const updatedTemplates = await getAdminTemplates();
        setTemplates(updatedTemplates);
      } else if (deleteConfirm.type === 'blog') {
        await deleteBlogPost(deleteConfirm.id);
        const updatedPosts = await getAdminBlogPosts();
        setBlogPosts(updatedPosts);
      }
      
      setDeleteConfirm({ show: false, type: null, id: null, title: '' });
      setSaveStatus({ 
        type: 'success', 
        message: `${deleteConfirm.type === 'template' ? 'Template' : 'Blog post'} deleted successfully!` 
      });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({ type: 'error', message: `Failed to delete: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, description: 'Dashboard & Analytics' },
    { id: 'templates', label: 'Templates', icon: <Package className="w-5 h-5" />, description: 'Manage n8n Templates' },
    { id: 'blog', label: 'Blog Posts', icon: <FileText className="w-5 h-5" />, description: 'Content Management' },
    { id: 'leads', label: 'Leads', icon: <Users className="w-5 h-5" />, description: 'Contact Submissions' },
    { id: 'site-settings', label: 'Site Settings', icon: <Globe className="w-5 h-5" />, description: 'Company & Contact Info' },
    { id: 'account', label: 'Account', icon: <Settings className="w-5 h-5" />, description: 'Password & API Keys' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
        </div>
      ) : error ? (
        <div className="card text-center py-8">
          <div className="text-red-500 mb-4">
            <LayoutDashboard className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-accent-gold mr-3" />
                <div>
                  <h3 className="text-lg font-semibold">Total Templates</h3>
                  <p className="text-2xl font-bold text-accent-gold">{stats.totalTemplates}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-accent-gold mr-3" />
                <div>
                  <h3 className="text-lg font-semibold">Blog Posts</h3>
                  <p className="text-2xl font-bold text-accent-gold">{stats.totalBlogPosts}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <UserPlus className="w-8 h-8 text-accent-gold mr-3" />
                <div>
                  <h3 className="text-lg font-semibold">New Leads</h3>
                  <p className="text-2xl font-bold text-accent-gold">{stats.recentContacts}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <Download className="w-8 h-8 text-accent-gold mr-3" />
                <div>
                  <h3 className="text-lg font-semibold">Total Downloads</h3>
                  <p className="text-2xl font-bold text-accent-gold">{stats.totalDownloads}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Templates */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Top Templates by Downloads</h3>
              <div className="space-y-3">
                {analytics.downloadStats.slice(0, 5).map((template, index) => (
                  <div key={template.title} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{template.title}</p>
                      <p className="text-sm text-gray-400">{template.category} • {template.is_pro ? 'Pro' : 'Free'}</p>
                    </div>
                    <span className="font-semibold">{template.download_count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top Categories */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
              <div className="space-y-3">
                {analytics.topCategories.slice(0, 5).map((category, index) => (
                  <div key={category.category} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{category.category}</p>
                      <p className="text-sm text-gray-400">{category.template_count} templates</p>
                    </div>
                    <span className="font-semibold">{category.total_downloads}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Leads</h3>
            <div className="space-y-4">
              {leads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-gray-400">{lead.email} - {lead.form_type}</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Template Management</h2>
        <button 
          onClick={handleCreateTemplate}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
        </div>
      ) : error ? (
        <div className="card text-center py-8">
          <div className="text-red-500 mb-4">
            <FileText className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Error Loading Templates</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3">Template</th>
                <th className="text-left py-3">Category</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Tutorial Link</th>
                <th className="text-left py-3">Downloads</th>
                <th className="text-left py-3">Rating</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="border-b border-gray-800">
                  <td className="py-3">{template.title}</td>
                  <td className="py-3">{template.category}</td>
                  <td className="py-3">{template.is_pro ? 'Pro' : 'Free'}</td>
                  <td className="py-3">
                    {template.tutorial_link ? (
                      <a 
                        href={template.tutorial_link} 
                        className="text-accent-gold hover:text-accent-gold/80 text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Tutorial
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">No tutorial</span>
                    )}
                  </td>
                  <td className="py-3">{template.download_count}</td>
                  <td className="py-3">{template.rating}</td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditTemplate(template)}
                        className="text-yellow-400 hover:text-yellow-300 p-1 rounded hover:bg-yellow-400/10"
                        title="Edit template"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTemplate(template)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10"
                        title="Delete template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {templates.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Templates Yet</h3>
              <p className="text-gray-400 mb-4">Start by creating your first template.</p>
              <button 
                onClick={handleCreateTemplate}
                className="btn-primary"
              >
                Create Template
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderBlogPosts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Post Management</h2>
        <button 
          onClick={handleCreateBlogPost}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Blog Post
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
        </div>
      ) : error ? (
        <div className="card text-center py-8">
          <div className="text-red-500 mb-4">
            <FileText className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Error Loading Blog Posts</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3">Title</th>
                <th className="text-left py-3">Author</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((post) => (
                <tr key={post.id} className="border-b border-gray-800">
                  <td className="py-3">{post.title}</td>
                  <td className="py-3">{post.author}</td>
                  <td className="py-3">{new Date(post.publication_date).toLocaleDateString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.is_published 
                        ? 'bg-green-900 bg-opacity-30 text-green-400' 
                        : 'bg-yellow-900 bg-opacity-30 text-yellow-400'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditBlogPost(post)}
                        className="text-yellow-400 hover:text-yellow-300 p-1 rounded hover:bg-yellow-400/10"
                        title="Edit blog post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBlogPost(post)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10"
                        title="Delete blog post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {blogPosts.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Blog Posts Yet</h3>
              <p className="text-gray-400 mb-4">Start by creating your first blog post.</p>
              <button 
                onClick={handleCreateBlogPost}
                className="btn-primary"
              >
                Create Blog Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lead Management</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
        </div>
      ) : error ? (
        <div className="card text-center py-8">
          <div className="text-red-500 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Error Loading Leads</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-800">
                  <td className="py-3">{lead.name}</td>
                  <td className="py-3">{lead.email}</td>
                  <td className="py-3">{lead.form_type}</td>
                  <td className="py-3">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderScheduleCalls = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Schedule Call Management</h2>
      <div className="card">
        <p className="text-gray-400">Schedule call management features will be implemented here.</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      {/* Status Message */}
      {saveStatus && (
        <div className={`card border-l-4 ${
          saveStatus.type === 'success' 
            ? 'border-green-500 bg-green-900/20 text-green-400' 
            : 'border-red-500 bg-red-900/20 text-red-400'
        }`}>
          <div className="flex items-center">
            {saveStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {saveStatus.message}
          </div>
        </div>
      )}
      
      {/* Account Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input 
              type="password" 
              className="form-input w-full"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input 
              type="password" 
              className="form-input w-full"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              required
              minLength="6"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input 
              type="password" 
              className="form-input w-full"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
              minLength="6"
            />
          </div>
          
          {passwordError && (
            <div className="text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {passwordError}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={passwordLoading}
            className="btn-primary flex items-center"
          >
            {passwordLoading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* API Configuration */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2" />
          API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <div className="flex items-center space-x-2">
              <input 
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="form-input flex-1 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                onClick={copyApiKey}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={regenerateApiKey}
                disabled={loadingApiKey}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 rounded-lg text-sm transition-colors"
              >
                {loadingApiKey ? 'Generating...' : 'Regenerate'}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">API Endpoints:</h4>
            <div className="text-sm text-gray-400 space-y-1 font-mono">
              <div>GET /api/n8n/templates - List all templates</div>
              <div>POST /api/n8n/templates - Create new template</div>
              <div>GET /api/n8n/blog-posts - List all blog posts</div>
              <div>POST /api/n8n/blog-posts - Create new blog post</div>
              <div>GET /api/n8n/analytics/dashboard - Get analytics</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Include header: X-API-Key: {apiKey.substring(0, 20)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderSiteSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <button 
          onClick={handleSaveSettings}
          disabled={settingsLoading}
          className="btn-primary flex items-center"
        >
          {settingsLoading ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {settingsLoading ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
      
      {/* Status Message */}
      {saveStatus && (
        <div className={`card border-l-4 ${
          saveStatus.type === 'success' 
            ? 'border-green-500 bg-green-900/20 text-green-400' 
            : 'border-red-500 bg-red-900/20 text-red-400'
        }`}>
          <div className="flex items-center">
            {saveStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {saveStatus.message}
          </div>
        </div>
      )}
      
      {/* Company Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siteSettings
            .filter(setting => setting.setting_key.startsWith('company_'))
            .map(setting => (
            <div key={setting.id}>
              <label className="block text-sm font-medium mb-2">
                {setting.setting_key.replace('company_', '').replace('_', ' ').toUpperCase()}
              </label>
              {setting.setting_type === 'json' ? (
                <textarea 
                  className="form-input w-full h-24"
                  value={typeof setting.setting_value === 'string' ? setting.setting_value : JSON.stringify(setting.setting_value, null, 2)}
                  onChange={(e) => {
                    const updated = siteSettings.map(s => 
                      s.id === setting.id ? { ...s, setting_value: e.target.value } : s
                    );
                    setSiteSettings(updated);
                  }}
                />
              ) : (
                <input 
                  type="text"
                  className="form-input w-full"
                  value={setting.setting_value || ''}
                  onChange={(e) => {
                    const updated = siteSettings.map(s => 
                      s.id === setting.id ? { ...s, setting_value: e.target.value } : s
                    );
                    setSiteSettings(updated);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siteSettings
            .filter(setting => setting.setting_key.startsWith('contact_') || setting.setting_key.includes('phone') || setting.setting_key.includes('email'))
            .map(setting => (
            <div key={setting.id}>
              <label className="block text-sm font-medium mb-2">
                {setting.setting_key.replace('contact_', '').replace('_', ' ').toUpperCase()}
              </label>
              <input 
                type={setting.setting_key.includes('email') ? 'email' : setting.setting_key.includes('phone') ? 'tel' : 'text'}
                className="form-input w-full"
                value={setting.setting_value || ''}
                onChange={(e) => {
                  const updated = siteSettings.map(s => 
                    s.id === setting.id ? { ...s, setting_value: e.target.value } : s
                  );
                  setSiteSettings(updated);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Social Media Links */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siteSettings
            .filter(setting => setting.setting_key.startsWith('social_'))
            .map(setting => (
            <div key={setting.id}>
              <label className="block text-sm font-medium mb-2">
                {setting.setting_key.replace('social_', '').toUpperCase()}
              </label>
              <input 
                type="url"
                className="form-input w-full"
                value={setting.setting_value || ''}
                onChange={(e) => {
                  const updated = siteSettings.map(s => 
                    s.id === setting.id ? { ...s, setting_value: e.target.value } : s
                  );
                  setSiteSettings(updated);
                }}
                placeholder={`https://${setting.setting_key.replace('social_', '')}.com/username`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'templates': return renderTemplates();
      case 'blog': return renderBlogPosts();
      case 'leads': return renderLeads();
      case 'site-settings': return renderSiteSettings();
      case 'account': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-primary-gray rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingTemplate ? 'Edit Template' : 'Create New Template'}
                </h3>
                <button 
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-primary-light"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSaveTemplate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input 
                      type="text" 
                      className="form-input w-full"
                      value={templateForm.title}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select 
                      className="form-input w-full"
                      value={templateForm.category}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Productivity">Productivity</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Integration">Integration</option>
                      <option value="Data Processing">Data Processing</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea 
                    className="form-textarea w-full"
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon</label>
                    <select 
                      className="form-input w-full"
                      value={templateForm.iconName}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, iconName: e.target.value }))}
                    >
                      <option value="workflow">Workflow</option>
                      <option value="mail">Mail</option>
                      <option value="share">Share</option>
                      <option value="target">Target</option>
                      <option value="package">Package</option>
                      <option value="database">Database</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={templateForm.isPro}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, isPro: e.target.checked }))}
                      />
                      Pro Template
                    </label>
                  </div>
                  
                  {templateForm.isPro && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (€)</label>
                      <input 
                        type="number" 
                        className="form-input w-full"
                        value={templateForm.price}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, price: e.target.value }))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tutorial Link</label>
                  <input 
                    type="url" 
                    className="form-input w-full"
                    value={templateForm.tutorialLink}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, tutorialLink: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Workflow JSON Data *</label>
                  <textarea 
                    className="form-textarea w-full font-mono text-sm"
                    value={templateForm.workflowData}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, workflowData: e.target.value }))}
                    required
                    rows={8}
                    placeholder='{"nodes": [], "connections": {}}'
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Title</label>
                    <input 
                      type="text" 
                      className="form-input w-full"
                      value={templateForm.seoTitle}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Description</label>
                    <input 
                      type="text" 
                      className="form-input w-full"
                      value={templateForm.seoDescription}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowTemplateModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Saving...' : (editingTemplate ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Blog Post Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-primary-gray rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingBlogPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h3>
                <button 
                  onClick={() => setShowBlogModal(false)}
                  className="text-gray-400 hover:text-primary-light"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSaveBlogPost} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input 
                      type="text" 
                      className="form-input w-full"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Author</label>
                    <input 
                      type="text" 
                      className="form-input w-full"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, author: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt *</label>
                  <textarea 
                    className="form-textarea w-full"
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    required
                    rows={3}
                    placeholder="Brief description of the blog post..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Content *</label>
                  <textarea 
                    className="form-textarea w-full"
                    value={blogForm.content}
                    onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={12}
                    placeholder="Full blog post content in Markdown format..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags</label>
                    <input 
                      type="text" 
                      className="form-input w-full"
                      value={blogForm.tags}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="automation, n8n, tutorial (comma separated)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                    <input 
                      type="url" 
                      className="form-input w-full"
                      value={blogForm.featuredImage}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Title</label>
                    <input 
                      type="text" 
                      className="form-input w-full"
                      value={blogForm.seoTitle}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Description</label>
                    <input 
                      type="text" 
                      className="form-input w-full"
                      value={blogForm.seoDescription}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={blogForm.isPublished}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                    />
                    Publish immediately
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowBlogModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Saving...' : (editingBlogPost ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-primary-gray rounded-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-xl font-bold">Confirm Deletion</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={() => setDeleteConfirm({ show: false, type: null, id: null, title: '' })}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary-gray border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <Link to="/" className="flex items-center">
            <img 
              src="/logos/ia-logo-small-light.png" 
              alt="Iacovici.it" 
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-bold">Admin</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-primary-light"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-accent-gold/20 text-accent-gold'
                  : 'text-gray-400 hover:text-primary-light hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-16 z-30 bg-primary-dark border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-primary-light"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center text-primary-dark font-bold">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;