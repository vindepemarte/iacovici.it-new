import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Workflow, 
  Smartphone, 
  Zap, 
  Server,
  Database,
  Shield,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Download
} from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      id: 'automation',
      icon: <Workflow className="w-12 h-12" />,
      title: 'n8n Workflow Automation',
      description: 'Custom workflow automations that connect your apps and services seamlessly, saving you hours of manual work each week.',
      features: [
        'Social media automation',
        'CRM integration',
        'Email marketing workflows',
        'Data synchronization',
        'Lead generation and nurturing',
        'E-commerce automation'
      ],
      benefits: [
        'Reduce manual work by up to 80%',
        'Eliminate human errors',
        '24/7 automated operations',
        'Scalable business processes'
      ],
      examples: [
        {
          title: 'Social Media Auto-Poster',
          description: 'Automatically post content to Twitter, LinkedIn, and Facebook from a single trigger with hashtag management.',
          icon: <TrendingUp className="w-6 h-6" />
        },
        {
          title: 'Email to CRM Sync',
          description: 'Sync new email contacts directly to your CRM system with automatic parsing of signatures and data extraction.',
          icon: <Database className="w-6 h-6" />
        },
        {
          title: 'Advanced Lead Scoring',
          description: 'Sophisticated lead scoring automation with multi-channel data integration and automated nurturing sequences.',
          icon: <Zap className="w-6 h-6" />
        }
      ],
      process: [
        'Analyze your current workflows',
        'Design automation architecture',
        'Build and test workflows',
        'Deploy and monitor performance'
      ],
      pricing: 'Starting from €400/project'
    },
    {
      id: 'development',
      icon: <Smartphone className="w-12 h-12" />,
      title: 'Web Development',
      description: 'Modern, responsive web applications built with cutting-edge technologies for optimal performance and user experience.',
      features: [
        'Mobile-first responsive design',
        'High-performance applications',
        'Secure database architecture',
        'SEO-optimized and accessible',
        'Real-time features',
        'API integrations'
      ],
      benefits: [
        'Mobile-first responsive design',
        'High-performance applications',
        'Secure database architecture',
        'SEO-optimized and accessible'
      ],
      examples: [
        {
          title: 'Custom Web Applications',
          description: 'React-based applications with real-time features, user authentication, and seamless API integrations.',
          icon: <Smartphone className="w-6 h-6" />
        },
        {
          title: 'Database Design & Management',
          description: 'PostgreSQL and MongoDB solutions with optimized queries, backup strategies, and scaling capabilities.',
          icon: <Database className="w-6 h-6" />
        },
        {
          title: 'API Development',
          description: 'RESTful and GraphQL APIs that connect your frontend applications with powerful backend services and automations.',
          icon: <Workflow className="w-6 h-6" />
        }
      ],
      process: [
        'Analyze requirements and create technical specifications',
        'Design user interface and database architecture',
        'Develop with modern frameworks and best practices', 
        'Deploy, test, and provide maintenance support'
      ],
      pricing: 'Starting from €1,200/project'
    },
    {
      id: 'ai',
      icon: <Zap className="w-12 h-12" />,
      title: 'AI Integration',
      description: 'Leverage artificial intelligence to enhance your business processes with intelligent automation and data insights.',
      features: [
        'Chatbots and virtual assistants',
        'Content generation and optimization',
        'Predictive analytics',
        'Natural language processing',
        'Image and voice recognition',
        'Personalization engines'
      ],
      benefits: [
        '24/7 customer support',
        'Enhanced decision making',
        'Personalized user experiences',
        'Automated content creation'
      ],
      examples: [
        {
          title: 'AI Customer Support',
          description: 'Intelligent chatbots that handle 80% of routine customer inquiries with smart escalation to human agents.',
          icon: <Zap className="w-6 h-6" />
        },
        {
          title: 'Content Generation',
          description: 'AI-powered content creation for blogs, social media, and marketing materials with brand voice consistency.',
          icon: <TrendingUp className="w-6 h-6" />
        },
        {
          title: 'Predictive Analytics',
          description: 'Machine learning models that forecast sales, customer behavior, and market trends for strategic planning.',
          icon: <Database className="w-6 h-6" />
        }
      ],
      process: [
        'Identify AI opportunities in your business',
        'Select appropriate AI technologies',
        'Train and fine-tune models',
        'Integrate and monitor AI systems'
      ],
      pricing: 'Starting from €800/project'
    },
    {
      id: 'servers',
      icon: <Server className="w-12 h-12" />,
      title: 'Server Setup & Management',
      description: 'Professional server infrastructure with monitoring, maintenance, and security hardening for reliable operations.',
      features: [
        'Cloud server deployment',
        'Container orchestration',
        'Security hardening',
        'Performance optimization',
        'Backup and disaster recovery',
        '24/7 monitoring and alerts'
      ],
      benefits: [
        '99.9% uptime guarantee',
        'Enterprise-grade security',
        'Scalable infrastructure',
        'Proactive monitoring'
      ],
      examples: [
        {
          title: 'Coolify Self-Hosting',
          description: 'Complete server setup with Coolify for self-hosting applications with automated deployments and SSL.',
          icon: <Server className="w-6 h-6" />
        },
        {
          title: 'Docker Orchestration',
          description: 'Containerized applications with Docker Compose and Kubernetes for scalable, maintainable deployments.',
          icon: <Workflow className="w-6 h-6" />
        },
        {
          title: 'Security Hardening',
          description: 'Server security configuration with firewalls, intrusion detection, and regular security updates.',
          icon: <Shield className="w-6 h-6" />
        }
      ],
      process: [
        'Infrastructure planning and design',
        'Server provisioning and configuration',
        'Security implementation',
        'Monitoring setup and ongoing maintenance'
      ],
      pricing: 'Starting from €300/month'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Professional Services - Automation, AI & Web Development | Iacovici.it</title>
        <meta name="description" content="Professional services including n8n workflow automation, AI integration, web development, and server management. Custom solutions to grow your business." />
        <meta name="keywords" content="n8n automation, AI integration, web development, server management, Coolify, business automation, workflow automation" />
        <meta property="og:title" content="Professional Services - Automation, AI & Web Development | Iacovici.it" />
        <meta property="og:description" content="Professional services including n8n workflow automation, AI integration, web development, and server management. Custom solutions to grow your business." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iacovici.it/services" />
        <meta property="og:image" content="/logos/ia-logo-web.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Services - Automation, AI & Web Development | Iacovici.it" />
        <meta name="twitter:description" content="Professional services including n8n workflow automation, AI integration, web development, and server management. Custom solutions to grow your business." />
        <meta name="twitter:image" content="/logos/ia-logo-web.png" />
        <link rel="canonical" href="https://iacovici.it/services" />
      </Helmet>
      
      <div className="min-h-screen pt-16">
        {/* Header */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Professional Services</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Comprehensive solutions to automate and optimize your business operations. 
                From workflow automation to AI integration and custom web development.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding bg-gradient-to-b from-primary-dark to-black">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="space-y-24">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
                >
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center">
                      <div className="text-accent-gold mr-4">
                        {service.icon}
                      </div>
                      <h2 className="text-3xl font-bold">{service.title}</h2>
                    </div>
                    
                    <p className="text-gray-300 text-lg">
                      {service.description}
                    </p>
                    
                    {/* Features */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-accent-gold mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Benefits */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Benefits</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {service.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-accent-gold mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    {/* Examples and Process */}
                    <div className="space-y-8">
                      {/* Examples */}
                      <div>
                        <h3 className="text-2xl font-semibold mb-6">Real-World Examples</h3>
                        <div className="space-y-4">
                          {service.examples.map((example, i) => (
                            <div key={i} className="card">
                              <div className="flex items-start">
                                <div className="text-accent-gold mr-4 mt-1">
                                  {example.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">{example.title}</h4>
                                  <p className="text-gray-400 text-sm">{example.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Process */}
                      <div>
                        <h3 className="text-2xl font-semibold mb-6">Our Process</h3>
                        <div className="space-y-4">
                          {service.process.map((step, i) => (
                            <div key={i} className="flex items-start">
                              <div className="bg-accent-gold text-primary-dark w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 mt-0.5 flex-shrink-0">
                                {i + 1}
                              </div>
                              <span className="text-gray-300">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="card bg-gradient-to-r from-accent-gold/20 to-accent-blue/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Ready to Get Started?</h3>
                          <p className="text-gray-300">{service.pricing}</p>
                        </div>
                        <Link to="/contact" className="btn-primary whitespace-nowrap">
                          Book Consultation
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-primary-gray to-primary-gray/50 rounded-3xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transform Your Business Today
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's discuss how our automation solutions can save you time, 
                reduce costs, and accelerate growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://cal.iacovici.it" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Schedule Free Consultation
                </a>
                <Link to="/templates" className="btn-secondary text-lg px-8 py-4">
                  <Download className="w-5 h-5 mr-2 inline" />
                  Browse Free Templates
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;