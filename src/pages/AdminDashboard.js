import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  UserPlus
} from 'lucide-react';
import { 
  getDashboardStats, 
  getDashboardAnalytics,
  getAdminTemplates, 
  getAdminBlogPosts, 
  getContactSubmissions 
} from '../utils/api';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalTemplates: 0,
    totalBlogPosts: 0,
    recentContacts: 0
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API Key management state
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loadingApiKey, setLoadingApiKey] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsData = await getDashboardStats();
        setStats(statsData);
        
        // Fetch analytics data
        const analyticsData = await getDashboardAnalytics();
        setAnalytics(analyticsData);
        
        // Fetch templates
        const templatesData = await getAdminTemplates();
        setTemplates(templatesData);
        
        // Fetch blog posts
        const blogPostsData = await getAdminBlogPosts();
        setBlogPosts(blogPostsData);
        
        // Fetch contact submissions
        const contactsData = await getContactSubmissions();
        setLeads(contactsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch API key on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        // This would be an API call to get the current user's API key
        // For now, we'll show a placeholder
        setApiKey('iak_live_********************************');
      } catch (err) {
        console.error('Error fetching API key:', err);
      }
    };
    fetchApiKey();
  }, []);

  const regenerateApiKey = async () => {
    setLoadingApiKey(true);
    try {
      // This would be an API call to regenerate the API key
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiKey('iak_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
      alert('API key regenerated successfully!');
    } catch (err) {
      console.error('Error regenerating API key:', err);
      alert('Failed to regenerate API key');
    } finally {
      setLoadingApiKey(false);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API key copied to clipboard!');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'templates', label: 'Templates', icon: <FileText className="w-5 h-5" /> },
    { id: 'blog', label: 'Blog Posts', icon: <FileText className="w-5 h-5" /> },
    { id: 'leads', label: 'Leads', icon: <Users className="w-5 h-5" /> },
    { id: 'calls', label: 'Schedule Calls', icon: <Calendar className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
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
                  <p className="text-2xl font-bold text-accent-gold">
                    {analytics.downloadStats.reduce((sum, template) => sum + parseInt(template.download_count || 0), 0)}
                  </p>
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
        <button className="btn-primary flex items-center">
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
                      <Link 
                        to={template.tutorial_link} 
                        className="text-accent-gold hover:text-accent-gold/80 text-sm"
                        target="_blank"
                      >
                        View Tutorial
                      </Link>
                    ) : (
                      <span className="text-gray-500 text-sm">No tutorial</span>
                    )}
                  </td>
                  <td className="py-3">{template.download_count}</td>
                  <td className="py-3">{template.rating}</td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
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

  const renderBlogPosts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Post Management</h2>
        <button className="btn-primary flex items-center">
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
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
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
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">N8N API Integration</h3>
          <p className="text-gray-400 mb-4">
            Use this API key to integrate with n8n workflows and manage your content programmatically.
          </p>
          
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
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={copyApiKey}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={regenerateApiKey}
                  disabled={loadingApiKey}
                  className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 rounded-lg text-sm"
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
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Payment Gateway</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stripe Publishable Key</label>
              <input 
                type="text" 
                className="form-input w-full" 
                placeholder="pk_test_..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Stripe Secret Key</label>
              <input 
                type="password" 
                className="form-input w-full" 
                placeholder="sk_test_..."
              />
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email From Address</label>
              <input 
                type="email" 
                className="form-input w-full" 
                placeholder="no-reply@iacovici.it"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email Service API Key</label>
              <input 
                type="password" 
                className="form-input w-full" 
                placeholder="your_api_key_here"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button className="btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'templates': return renderTemplates();
      case 'blog': return renderBlogPosts();
      case 'leads': return renderLeads();
      case 'calls': return renderScheduleCalls();
      case 'settings': return renderSettings();
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
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors">
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