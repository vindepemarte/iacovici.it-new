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

  // Fallback copy function for browsers that don't support clipboard API
  const copyToClipboardFallback = (text, templateTitle) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopySuccess(`Copied ${templateTitle} workflow to clipboard!`);
      } else {
        setCopySuccess('Please manually copy the workflow from the modal.');
        // Show the workflow in a modal or alert
        alert(`Workflow JSON:\n\n${text}`);
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      setCopySuccess('Copy failed. Please manually select and copy the workflow.');
      // Show the workflow in a modal or alert
      alert(`Workflow JSON:\n\n${text}`);
    }
  };
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
        setError(null);
        
        // Fetch from database API
        const data = await getTemplates();
        
        // Add slug property for linking
        const templatesWithSlug = data.map(template => ({
          ...template,
          slug: template.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
          rating: template.rating || generateRandomRating(),
          icon: getIconComponent(template.icon_name)
        }));
        setTemplates(templatesWithSlug);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError(`Failed to load templates: ${err.message}`);
        setTemplates([]);
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
    try {
      console.log('Template data:', template); // Debug log
      
      // Validate that we have workflow data
      if (!template.workflow_data_json) {
        console.error('No workflow_data_json found in template:', template);
        
        // Create a fallback sample workflow for testing
        const sampleWorkflow = {
          "name": template.title || "Sample Workflow",
          "nodes": [
            {
              "id": "webhook",
              "name": "Webhook",
              "type": "n8n-nodes-base.webhook",
              "position": [250, 300],
              "parameters": {
                "httpMethod": "GET",
                "path": "test"
              }
            },
            {
              "id": "set",
              "name": "Set",
              "type": "n8n-nodes-base.set",
              "position": [450, 300],
              "parameters": {
                "values": {
                  "string": [
                    {
                      "name": "message",
                      "value": "Hello from n8n!"
                    }
                  ]
                }
              }
            }
          ],
          "connections": {
            "webhook": {
              "main": [
                [
                  {
                    "node": "set",
                    "type": "main",
                    "index": 0
                  }
                ]
              ]
            }
          }
        };
        
        const workflowJson = JSON.stringify(sampleWorkflow, null, 2);
        
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(workflowJson);
          setCopySuccess(`Copied sample workflow for ${template.title} to clipboard! (No workflow data was available, so a sample was used)`);
        } else {
          copyToClipboardFallback(workflowJson, template.title);
        }
        
        setTimeout(() => setCopySuccess(''), 5000);
        return;
      }

      let workflowJson;
      try {
        // Handle both string and object formats
        if (typeof template.workflow_data_json === 'string') {
          const parsed = JSON.parse(template.workflow_data_json);
          workflowJson = JSON.stringify(parsed, null, 2);
        } else if (typeof template.workflow_data_json === 'object') {
          workflowJson = JSON.stringify(template.workflow_data_json, null, 2);
        } else {
          throw new Error('Invalid workflow data format');
        }
      } catch (parseError) {
        console.error('Error processing workflow data:', parseError);
        setCopySuccess('Error: Invalid workflow data format');
        setTimeout(() => setCopySuccess(''), 3000);
        return;
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(workflowJson);
        setCopySuccess(`Copied ${template.title} workflow to clipboard!`);
      } else {
        copyToClipboardFallback(workflowJson, template.title);
      }
      
      // Track the download (optional)
      try {
        await trackTemplateDownload(
          template.id, 
          'anonymous', // No email for now
          null,
          'free'
        );
      } catch (err) {
        console.error('Error tracking download:', err);
        // Don't fail the copy operation for tracking errors
      }
      
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Failed to copy workflow. Please try again.');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };


  const importToN8n = async (template) => {
    try {
      console.log('Template data for import:', template); // Debug log
      
      let workflowData;
      
      // Handle missing workflow data
      if (!template.workflow_data_json) {
        console.warn('No workflow_data_json found, using sample workflow');
        
        // Create a fallback sample workflow for testing
        const sampleWorkflow = {
          "name": template.title || "Sample Workflow",
          "nodes": [
            {
              "id": "webhook",
              "name": "Webhook",
              "type": "n8n-nodes-base.webhook",
              "position": [250, 300],
              "parameters": {
                "httpMethod": "GET",
                "path": "test"
              }
            }
          ],
          "connections": {}
        };
        
        workflowData = JSON.stringify(sampleWorkflow);
        setCopySuccess(`Opening n8n import for ${template.title} (using sample workflow)...`);
      } else {
        // Use actual workflow data
        try {
          if (typeof template.workflow_data_json === 'string') {
            workflowData = template.workflow_data_json;
          } else if (typeof template.workflow_data_json === 'object') {
            workflowData = JSON.stringify(template.workflow_data_json);
          } else {
            throw new Error('Invalid workflow data format');
          }
          setCopySuccess(`Opening n8n import for ${template.title}...`);
        } catch (importError) {
          console.error('Error processing workflow data:', importError);
          setCopySuccess('Error: Cannot import invalid workflow data');
          setTimeout(() => setCopySuccess(''), 3000);
          return;
        }
      }
      
      const encodedData = encodeURIComponent(workflowData);
      const importUrl = `https://n8n.io/import?data=${encodedData}`;
      window.open(importUrl, '_blank');
      
      setTimeout(() => setCopySuccess(''), 3000);
      
      // Track the download (optional)
      try {
        await trackTemplateDownload(
          template.id, 
          'anonymous', // No email for now
          null,
          'import'
        );
      } catch (err) {
        console.error('Error tracking download:', err);
        // Don't fail the import operation for tracking errors
      }
      
    } catch (err) {
      console.error('Failed to import:', err);
      setCopySuccess('Failed to import workflow. Please try again.');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };


  const downloadWorkflow = async (template) => {
    try {
      console.log('Template data for download:', template); // Debug log
      
      let workflowJson;
      
      // Handle missing workflow data
      if (!template.workflow_data_json) {
        console.warn('No workflow_data_json found, using sample workflow');
        
        // Create a fallback sample workflow for testing
        const sampleWorkflow = {
          "name": template.title || "Sample Workflow",
          "nodes": [
            {
              "id": "webhook",
              "name": "Webhook",
              "type": "n8n-nodes-base.webhook",
              "position": [250, 300],
              "parameters": {
                "httpMethod": "GET",
                "path": "test"
              }
            }
          ],
          "connections": {}
        };
        
        workflowJson = JSON.stringify(sampleWorkflow, null, 2);
      } else {
        // Use actual workflow data
        try {
          // Handle both string and object formats
          if (typeof template.workflow_data_json === 'string') {
            const parsed = JSON.parse(template.workflow_data_json);
            workflowJson = JSON.stringify(parsed, null, 2);
          } else if (typeof template.workflow_data_json === 'object') {
            workflowJson = JSON.stringify(template.workflow_data_json, null, 2);
          } else {
            throw new Error('Invalid workflow data format');
          }
        } catch (parseError) {
          console.error('Error processing workflow data:', parseError);
          setCopySuccess('Error: Invalid workflow data format');
          setTimeout(() => setCopySuccess(''), 3000);
          return;
        }
      }

      // Create and download the JSON file
      const blob = new Blob([workflowJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from template title
      const filename = `${template.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setCopySuccess(`Downloaded ${template.title} workflow as ${filename}${!template.workflow_data_json ? ' (sample workflow)' : ''}`);
      
      // Track the download (optional)
      try {
        await trackTemplateDownload(
          template.id, 
          'anonymous', // No email for now
          null,
          'download'
        );
      } catch (err) {
        console.error('Error tracking download:', err);
        // Don't fail the download operation for tracking errors
      }
      
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to download:', err);
      setCopySuccess('Failed to download workflow. Please try again.');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };


  const handleWhatsAppPurchase = (template) => {
    const message = `Hi! I'm interested in purchasing the "${template.title}" template for €${template.price}. Could you please help me with the purchase process?`;
    const whatsappUrl = `https://wa.me/393780875700?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTutorialClick = (template) => {
    if (!template.tutorial_link) {
      setCopySuccess('No tutorial available for this template');
      setTimeout(() => setCopySuccess(''), 3000);
      return;
    }
    
    // If the tutorial_link starts with 'http' or 'https', open it as external link
    if (template.tutorial_link.startsWith('http')) {
      window.open(template.tutorial_link, '_blank');
    } else {
      // Internal link - navigate to blog post and scroll to top
      // Remove leading slash if present
      const link = template.tutorial_link.startsWith('/') ? template.tutorial_link.slice(1) : template.tutorial_link;
      
      // Scroll to top before navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Small delay to ensure scroll happens before navigation
      setTimeout(() => {
        navigate(`/${link}`);
      }, 100);
    }
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                      : 'bg-primary-gray text-gray-300 hover:bg-gray-600 hover:text-accent-gold'
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
                ? 'bg-red-900 bg-opacity-90 text-red-200' 
                : 'bg-green-900 bg-opacity-90 text-green-200'
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
                    className="group card hover:scale-105 hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
                  >
                    {template.is_pro && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-accent-gold to-yellow-500 text-primary-dark px-2 py-1 rounded-full text-xs font-bold z-10">
                        PRO
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-gradient-to-br from-primary-dark to-primary-gray rounded-lg p-3 group-hover:scale-110 transition-transform duration-300">
                        {template.icon}
                      </div>
                      <div className="flex items-center bg-primary-gray group-hover:bg-gray-600 px-3 py-1 rounded-full transition-colors duration-300">
                        <Star className="w-4 h-4 text-accent-gold mr-1" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-accent-gold transition-colors duration-300">
                      {template.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span className="bg-primary-gray group-hover:bg-gray-600 px-3 py-1 rounded-full transition-colors duration-300">
                        {template.category}
                      </span>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        <span>{template.download_count.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {template.is_pro ? (
                        <div className="flex items-center bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium border border-yellow-600">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          €{template.price}
                        </div>
                      ) : (
                        <button
                          onClick={() => downloadWorkflow(template)}
                          className="flex items-center bg-green-900 hover:bg-green-800 text-green-400 hover:text-green-300 px-3 py-2 rounded-lg text-sm font-medium border border-green-400 transition-colors duration-200 cursor-pointer"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Free Download
                        </button>
                      )}
                      {template.tutorial_link && (
                        <button
                          onClick={() => handleTutorialClick(template)}
                          className="flex items-center bg-blue-900 hover:bg-blue-800 text-blue-400 hover:text-blue-300 px-3 py-1 rounded text-xs transition-colors duration-200 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Tutorial
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {template.is_pro ? (
                        <button
                          onClick={() => handleWhatsAppPurchase(template)}
                          className="group btn-primary flex-1 flex items-center justify-center hover:shadow-lg transition-all duration-300"
                        >
                          <MessageSquare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Purchase Now
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => copyWorkflow(template)}
                            className="group btn-secondary flex-1 flex items-center justify-center hover:scale-105 transition-all duration-300"
                          >
                            <Copy className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                            Copy JSON
                          </button>
                          <button
                            onClick={() => importToN8n(template)}
                            className="group btn-primary flex-1 flex items-center justify-center hover:scale-105 transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
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
    </>
  );
};

export default TemplatesPage;