import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Copy,
  ExternalLink,
  ShoppingCart,
  Star,
  Download,
  Share2,
  Mail,
  Database,
  MessageSquare,
  Workflow,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getTemplates, trackTemplateDownload } from '../utils/api';

const TemplatesPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Generate random rating for templates that don't have one
  const generateRandomRating = () => {
    return (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
  };

  // Get icon component based on icon name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'share': return <Share2 className="w-6 h-6" />;
      case 'mail': return <Mail className="w-6 h-6" />;
      case 'target': return <Star className="w-6 h-6" />;
      case 'package': return <ShoppingCart className="w-6 h-6" />;
      case 'database': return <Database className="w-6 h-6" />;
      case 'message': return <MessageSquare className="w-6 h-6" />;
      default: return <Workflow className="w-6 h-6" />;
    }
  };

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await getTemplates();
        // Add slug property for linking
        const templatesWithSlug = data.map(template => ({
          ...template,
          slug: template.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
          rating: template.rating || generateRandomRating(), // Use database rating or generate random
          icon: getIconComponent(template.icon_name)
        }));
        setTemplates(templatesWithSlug);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(templates.map(template => template.category))];

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyWorkflow = async (template) => {
    // Show email modal before allowing copy
    setSelectedTemplate(template);
    setPendingAction('copy');
    setShowEmailModal(true);
  };

  const importToN8n = (template) => {
    // Show email modal before allowing import
    setSelectedTemplate(template);
    setPendingAction('import');
    setShowEmailModal(true);
  };

  const handleStripeCheckout = async (template) => {
    // Navigate to checkout page with template data
    navigate('/checkout', { state: { template } });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTemplate) {
      setCopySuccess('Error: No template selected');
      setTimeout(() => setCopySuccess(''), 3000);
      return;
    }
    
    try {
      // Track the download in the backend
      await trackTemplateDownload(
        selectedTemplate.id, 
        email, 
        null, // IP address will be determined by backend
        pendingAction === 'copy' ? 'free' : 'import'
      );
      
      // Execute the pending action
      if (pendingAction === 'copy') {
        // Actually copy the workflow
        const workflowJson = JSON.stringify(selectedTemplate.workflow_data_json, null, 2);
        navigator.clipboard.writeText(workflowJson)
          .then(() => {
            setCopySuccess(`Copied ${selectedTemplate.title} workflow to clipboard!`);
          })
          .catch(err => {
            console.error('Failed to copy:', err);
            setCopySuccess('Failed to copy workflow. Please try again.');
          });
      } else if (pendingAction === 'import') {
        // Actually import to n8n
        const workflowData = encodeURIComponent(JSON.stringify(selectedTemplate.workflow_data_json));
        const importUrl = `https://n8n.io/import?data=${workflowData}`;
        window.open(importUrl, '_blank');
      }
    } catch (err) {
      console.error('Error tracking download:', err);
      setCopySuccess('Error tracking download. Please try again.');
      setTimeout(() => setCopySuccess(''), 3000);
    }
    
    // Close the modal and reset state
    setShowEmailModal(false);
    setEmail('');
    setPendingAction(null);
    setSelectedTemplate(null);
    
    // Show success message for copy action
    if (pendingAction === 'copy') {
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  const handleEmailModalClose = () => {
    setShowEmailModal(false);
    setEmail('');
    setPendingAction(null);
    setSelectedTemplate(null);
  };

  return (
    <>
      <Helmet>
        <title>n8n Workflow Templates - Free Automation Solutions | Iacovici.it</title>
        <meta name="description" content="Free n8n workflow templates for business automation. Automate social media, CRM integration, marketing, e-commerce, and more with our ready-to-use templates." />
        <meta name="keywords" content="n8n, workflow templates, automation, business automation, free templates, CRM integration, social media automation" />
        <meta property="og:title" content="n8n Workflow Templates - Free Automation Solutions | Iacovici.it" />
        <meta property="og:description" content="Free n8n workflow templates for business automation. Automate social media, CRM integration, marketing, e-commerce, and more with our ready-to-use templates." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iacovici.it/templates" />
        <meta property="og:image" content="/logos/ia-logo-web.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="n8n Workflow Templates - Free Automation Solutions | Iacovici.it" />
        <meta name="twitter:description" content="Free n8n workflow templates for business automation. Automate social media, CRM integration, marketing, e-commerce, and more with our ready-to-use templates." />
        <meta name="twitter:image" content="/logos/ia-logo-web.png" />
        <link rel="canonical" href="https://iacovici.it/templates" />
      </Helmet>
      
      <div className="min-h-screen pt-16">
        {/* Header Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">n8n Workflow Templates</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Ready-to-use automation templates to save you hours of setup time. 
                Import directly into n8n or copy the JSON to get started instantly.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search templates by name or description..."
                  className="form-input w-full pl-12 pr-4 py-4 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Mobile Filter Button */}
            <div className="md:hidden mb-6">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="btn-secondary w-full flex items-center justify-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filter by Category
              </button>
            </div>

            {/* Filter Categories */}
            <div className={`md:flex justify-center flex-wrap gap-2 mb-8 ${isFilterOpen ? 'block' : 'hidden md:flex'}`}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-accent-gold text-primary-dark'
                      : 'bg-primary-gray text-gray-300 hover:bg-accent-gold/20 hover:text-accent-gold'
                  }`}
                >
                  {category}
                  {selectedCategory === category && (
                    <X 
                      className="w-4 h-4 inline-block ml-2 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory('All');
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Copy Success Message */}
        {copySuccess && (
          <div className="fixed top-24 right-4 z-50">
            <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center ${
              copySuccess.includes('Error') || copySuccess.includes('Failed') 
                ? 'bg-red-900/90 text-red-200' 
                : 'bg-green-900/90 text-green-200'
            }`}>
              {copySuccess.includes('Error') || copySuccess.includes('Failed') ? (
                <AlertCircle className="w-5 h-5 mr-2" />
              ) : (
                <CheckCircle className="w-5 h-5 mr-2" />
              )}
              {copySuccess}
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <section className="section-padding bg-gradient-to-b from-primary-dark to-black">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-2">
                {selectedCategory === 'All' ? 'All Templates' : selectedCategory}
              </h2>
              <p className="text-gray-400">
                Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
              </div>
            ) : error ? (
              <div className="card text-center py-12">
                <div className="text-red-500 mb-4">
                  <AlertCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Error Loading Templates</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Workflow className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Templates Found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or category filter.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-primary-dark rounded-lg p-3">
                        {template.icon}
                      </div>
                      <div className="flex items-center bg-primary-gray px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-accent-gold mr-1" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{template.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{template.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <span className="bg-primary-gray px-2 py-1 rounded mr-2">{template.category}</span>
                      <Download className="w-4 h-4 mr-1" />
                      <span>{template.download_count}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {template.is_pro ? (
                        <span className="bg-accent-gold/20 text-accent-gold px-2 py-1 rounded text-xs font-medium">
                          Pro Template
                        </span>
                      ) : (
                        <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs font-medium">
                          Free
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {template.is_pro ? (
                        <button
                          onClick={() => handleStripeCheckout(template)}
                          className="btn-primary flex-1 flex items-center justify-center"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy €{template.price}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => copyWorkflow(template)}
                            className="btn-secondary flex-1 flex items-center justify-center"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </button>
                          <button
                            onClick={() => importToN8n(template)}
                            className="btn-primary flex-1 flex items-center justify-center"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Import
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Email Collection Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full relative">
            <button
              onClick={handleEmailModalClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-primary-light"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="bg-primary-dark rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-accent-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {pendingAction === 'copy' ? 'Copy Workflow' : 'Import to n8n'}
              </h3>
              <p className="text-gray-400">
                Enter your email to access the {selectedTemplate?.title} template
              </p>
            </div>
            
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="form-input w-full"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">
                  We'll send you download instructions and updates
                </p>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full"
              >
                {pendingAction === 'copy' ? 'Copy Workflow' : 'Import to n8n'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplatesPage;