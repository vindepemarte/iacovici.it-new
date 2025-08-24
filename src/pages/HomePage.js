import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Shield, 
  Server,
  Workflow,
  Smartphone,
  Database,
  CheckCircle,
  ExternalLink,
  Download,
  Star
} from 'lucide-react';

const HomePage = () => {
  const stats = [
    { value: '5000+', label: 'Businesses Automated' },
    { value: '50+', label: 'Workflow Templates' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  const services = [
    {
      id: 'automation',
      icon: <Workflow className="w-12 h-12" />,
      title: 'n8n Automation',
      description: 'Custom workflow automations that connect your apps and services seamlessly.',
      features: [
        'Social media automation',
        'CRM integration',
        'Email marketing workflows',
        'Data synchronization'
      ]
    },
    {
      id: 'development',
      icon: <Smartphone className="w-12 h-12" />,
      title: 'Web Development',
      description: 'Modern, responsive web applications built with cutting-edge technologies.',
      features: [
        'Mobile-first responsive design',
        'High-performance applications',
        'Secure database architecture',
        'SEO-optimized and accessible'
      ]
    },
    {
      id: 'ai',
      icon: <Zap className="w-12 h-12" />,
      title: 'AI Integration',
      description: 'Leverage artificial intelligence to enhance your business processes.',
      features: [
        'Chatbots and virtual assistants',
        'Content generation and optimization',
        'Predictive analytics',
        'Natural language processing'
      ]
    },
    {
      id: 'servers',
      icon: <Server className="w-12 h-12" />,
      title: 'Server Setup & Management',
      description: 'Professional server infrastructure with monitoring and maintenance.',
      features: [
        'Cloud server deployment',
        'Container orchestration',
        'Security hardening',
        'Performance optimization'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      company: 'TechStart Inc.',
      content: 'Iacovici.it transformed our customer onboarding process with their n8n automation. We saved 20 hours per week and reduced errors by 95%.',
      rating: 5
    },
    {
      name: 'David Chen',
      company: 'Global Solutions Ltd.',
      content: 'The custom web application they built for us exceeded our expectations. It\'s fast, secure, and exactly what our team needed to be more productive.',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      company: 'Innovate Co.',
      content: 'Their AI integration helped us analyze customer data in ways we never thought possible. Our sales team now has actionable insights at their fingertips.',
      rating: 5
    }
  ];

  return (
    <>
      <Helmet>
        <title>AI & Automation Solutions for Business Growth | Iacovici.it</title>
        <meta name="description" content="Transform your business with intelligent automation, AI integration, and modern web solutions. Save time, reduce errors, and scale efficiently with our proven n8n workflows and custom development services." />
        <meta name="keywords" content="n8n automation, AI solutions, web development, server management, Coolify, business automation, workflow automation" />
        <meta property="og:title" content="AI & Automation Solutions for Business Growth | Iacovici.it" />
        <meta property="og:description" content="Transform your business with intelligent automation, AI integration, and modern web solutions. Save time, reduce errors, and scale efficiently with our proven n8n workflows and custom development services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iacovici.it" />
        <meta property="og:image" content="/logos/ia-logo-web.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI & Automation Solutions for Business Growth | Iacovici.it" />
        <meta name="twitter:description" content="Transform your business with intelligent automation, AI integration, and modern web solutions. Save time, reduce errors, and scale efficiently with our proven n8n workflows and custom development services." />
        <meta name="twitter:image" content="/logos/ia-logo-web.png" />
        <link rel="canonical" href="https://iacovici.it" />
      </Helmet>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-24 pb-16 section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="gradient-text">AI & Automation Solutions</span>
                  <br />
                  <span className="text-primary-light">to Grow Your Business</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Transform your business with intelligent automation, AI integration, 
                  and modern web solutions. Save time, reduce errors, and scale efficiently 
                  with our proven n8n workflows and custom development services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact" className="btn-primary text-lg px-8 py-4">
                    Book Free Consultation
                  </Link>
                  <Link to="/templates" className="btn-secondary text-lg px-8 py-4">
                    Browse Free Templates
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-primary-gray rounded-2xl p-8 shadow-2xl">
                  <img 
                    src="/logos/ia-logo-bg.png" 
                    alt="Iacovici.it Solutions" 
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  <div className="absolute -top-4 -right-4 bg-accent-gold text-primary-dark px-4 py-2 rounded-full font-semibold">
                    Free Templates Available!
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-accent-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section-padding bg-gradient-to-b from-primary-dark to-black">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">Our Services</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive solutions to automate and optimize your business operations
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-accent-gold mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-accent-gold mr-2" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/services" className="btn-primary text-lg px-8 py-4">
                Explore All Services
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
            </div>
          </div>
        </section>

        {/* Templates Preview */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">Ready-to-Use Templates</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Jumpstart your automation with our collection of pre-built n8n workflows
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card text-center"
              >
                <div className="bg-primary-dark rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Workflow className="w-8 h-8 text-accent-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Social Media Automation</h3>
                <p className="text-gray-400 mb-6">
                  Automatically post content to Twitter, LinkedIn, and Facebook from a single trigger.
                </p>
                <Link to="/templates" className="text-accent-gold hover:text-accent-gold/80 font-medium flex items-center justify-center">
                  View Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card text-center"
              >
                <div className="bg-primary-dark rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Database className="w-8 h-8 text-accent-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-4">CRM Integration</h3>
                <p className="text-gray-400 mb-6">
                  Sync new email contacts directly to your CRM system with automatic parsing.
                </p>
                <Link to="/templates" className="text-accent-gold hover:text-accent-gold/80 font-medium flex items-center justify-center">
                  View Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card text-center"
              >
                <div className="bg-primary-dark rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-accent-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Lead Scoring</h3>
                <p className="text-gray-400 mb-6">
                  Sophisticated lead scoring automation with multi-channel data integration.
                </p>
                <Link to="/templates" className="text-accent-gold hover:text-accent-gold/80 font-medium flex items-center justify-center">
                  View Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            </div>

            <div className="text-center">
              <Link to="/templates" className="btn-primary text-lg px-8 py-4">
                <Download className="w-5 h-5 mr-2 inline" />
                Browse All Templates
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding bg-gradient-to-b from-black to-primary-dark">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">What Our Clients Say</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Don't just take our word for it - hear from businesses we've helped transform
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-accent-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-accent-gold/20 to-accent-blue/20 rounded-3xl p-8 md:p-12"
            >
              <TrendingUp className="w-16 h-16 text-accent-gold mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Automate Your Business?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join hundreds of businesses that have transformed their operations 
                with our automation solutions. Start with a free consultation and 
                discover what's possible for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn-primary text-lg px-8 py-4">
                  Book Free Consultation
                </Link>
                <Link to="/templates" className="btn-secondary text-lg px-8 py-4">
                  Download Free Templates
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;