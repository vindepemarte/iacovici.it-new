import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Calendar
} from 'lucide-react';
import { submitContactForm } from '../utils/api';
import { useContactInfo, useSocialLinks, useCompanyInfo, useSiteUrls } from '../hooks/useSiteSettings';

const ContactPage = () => {
  const contactInfo = useContactInfo();
  const socialLinks = useSocialLinks();
  const companyInfo = useCompanyInfo();
  const siteUrls = useSiteUrls();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    formType: 'contact'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await submitContactForm(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        message: '',
        formType: 'contact'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Automation Solutions | Iacovici.it</title>
        <meta name="description" content="Get in touch with Iacovici.it for automation solutions, n8n workflows, AI integration, and custom web development services. Schedule a free consultation today." />
        <meta name="keywords" content="contact us, automation solutions, n8n workflows, AI integration, web development, free consultation" />
        <meta property="og:title" content="Contact Us - Automation Solutions | Iacovici.it" />
        <meta property="og:description" content="Get in touch with Iacovici.it for automation solutions, n8n workflows, AI integration, and custom web development services. Schedule a free consultation today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iacovici.it/contact" />
        <meta property="og:image" content="/logos/ia-logo-web.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us - Automation Solutions | Iacovici.it" />
        <meta name="twitter:description" content="Get in touch with Iacovici.it for automation solutions, n8n workflows, AI integration, and custom web development services. Schedule a free consultation today." />
        <meta name="twitter:image" content="/logos/ia-logo-web.png" />
        <link rel="canonical" href="https://iacovici.it/contact" />
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
                <span className="gradient-text">Get in Touch</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Have questions about our automation solutions? Want to schedule a free consultation? 
                We're here to help you transform your business operations.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start group hover:bg-primary-gray/30 p-4 rounded-lg transition-colors duration-300">
                    <div className="bg-primary-gray group-hover:bg-accent-gold/20 rounded-lg p-3 mr-4 transition-colors duration-300">
                      <Mail className="w-6 h-6 text-accent-gold group-hover:text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                      <a 
                        href={`mailto:${contactInfo.email}`}
                        className="text-gray-400 hover:text-accent-gold transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  
                  {contactInfo.phone && (
                    <div className="flex items-start group hover:bg-primary-gray/30 p-4 rounded-lg transition-colors duration-300">
                      <div className="bg-primary-gray group-hover:bg-accent-gold/20 rounded-lg p-3 mr-4 transition-colors duration-300">
                        <Phone className="w-6 h-6 text-accent-gold group-hover:text-accent-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                        <a 
                          href={`tel:${contactInfo.phone}`}
                          className="text-gray-400 hover:text-accent-gold transition-colors"
                        >
                          {contactInfo.phone}
                        </a>
                        <p className="text-sm text-gray-500 mt-1">Monday-Friday, 9AM-5PM EET</p>
                      </div>
                    </div>
                  )}
                  
                  {contactInfo.address && (
                    <div className="flex items-start group hover:bg-primary-gray/30 p-4 rounded-lg transition-colors duration-300">
                      <div className="bg-primary-gray group-hover:bg-accent-gold/20 rounded-lg p-3 mr-4 transition-colors duration-300">
                        <MapPin className="w-6 h-6 text-accent-gold group-hover:text-accent-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                        <div className="text-gray-400">
                          {typeof contactInfo.address === 'string' ? (
                            <p>{contactInfo.address}</p>
                          ) : contactInfo.address && typeof contactInfo.address === 'object' ? (
                            <div>
                              <p>{contactInfo.address.street}</p>
                              <p>{contactInfo.address.city}, {contactInfo.address.zip}</p>
                              <p>{contactInfo.address.country}</p>
                            </div>
                          ) : (
                            <p>Address not available</p>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Available for in-person meetings by appointment</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start group hover:bg-primary-gray/30 p-4 rounded-lg transition-colors duration-300">
                    <div className="bg-primary-gray group-hover:bg-accent-gold/20 rounded-lg p-3 mr-4 transition-colors duration-300">
                      <Clock className="w-6 h-6 text-accent-gold group-hover:text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                      <p className="text-gray-400">Monday - Friday: 9:00 AM - 5:00 PM EET</p>
                      <p className="text-gray-400">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-6">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.github && (
                      <a 
                        href={socialLinks.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-primary-gray hover:bg-accent-gold/20 hover:scale-110 p-3 rounded-lg transition-all duration-300"
                        title="GitHub"
                      >
                        <span className="sr-only">GitHub</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                    {socialLinks.telegram && (
                      <a 
                        href={socialLinks.telegram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-primary-gray hover:bg-accent-gold/20 hover:scale-110 p-3 rounded-lg transition-all duration-300"
                        title="Telegram"
                      >
                        <span className="sr-only">Telegram</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.377 0 0 5.377 0 12s5.377 12 12 12 12-5.377 12-12S18.623 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.141-.259.259-.374.261l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.57-4.458c.538-.196 1.006.128.832.941z"/>
                        </svg>
                      </a>
                    )}
                    {socialLinks.linkedin && (
                      <a 
                        href={socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-primary-gray hover:bg-accent-gold/20 hover:scale-110 p-3 rounded-lg transition-all duration-300"
                        title="LinkedIn"
                      >
                        <span className="sr-only">LinkedIn</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                  
                  {submitStatus === 'success' ? (
                    <div className="bg-green-900/30 border border-green-500 text-green-300 p-6 rounded-lg text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                      <p className="mb-6">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => setSubmitStatus(null)}
                        className="btn-primary"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {submitStatus === 'error' && (
                        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          There was an error sending your message. Please try again.
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className={`form-input w-full transition-all duration-300 ${
                            focusedField === 'name' ? 'ring-2 ring-accent-gold/50 border-accent-gold' : ''
                          }`}
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className={`form-input w-full transition-all duration-300 ${
                            focusedField === 'email' ? 'ring-2 ring-accent-gold/50 border-accent-gold' : ''
                          }`}
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Your Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          className={`form-input w-full transition-all duration-300 resize-none ${
                            focusedField === 'message' ? 'ring-2 ring-accent-gold/50 border-accent-gold' : ''
                          }`}
                          placeholder="Tell us about your project, questions, or how we can help you automate your business processes..."
                          value={formData.message}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                        ></textarea>
                        <div className="text-sm text-gray-500 mt-1">
                          {formData.message.length > 0 && (
                            <span className={formData.message.length < 20 ? 'text-yellow-400' : 'text-green-400'}>
                              {formData.message.length} characters
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                        className={`group relative w-full btn-primary flex items-center justify-center overflow-hidden transition-all duration-300 ${
                          isSubmitting || !formData.name || !formData.email || !formData.message
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-gold to-accent-blue opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                            Send Message
                          </>
                        )}
                      </button>
                      
                      <p className="text-xs text-gray-400 text-center">
                        By sending this message, you agree to our{' '}
                        <Link to="/privacy-policy" className="text-accent-gold hover:underline">
                          Privacy Policy
                        </Link>{' '}
                        and{' '}
                        <Link to="/terms-of-service" className="text-accent-gold hover:underline">
                          Terms of Service
                        </Link>.
                      </p>
                    </form>
                  )}
                </div>
                
                {/* Free Consultation CTA */}
                <div className="card mt-8 bg-gradient-to-br from-accent-gold/20 via-accent-blue/10 to-primary-gray border border-accent-gold/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 to-transparent"></div>
                  <div className="relative text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-gold/20 rounded-full mb-4">
                      <Calendar className="w-8 h-8 text-accent-gold" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 gradient-text">Schedule a Free 30-Minute Consultation</h3>
                    <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                      Get expert advice on automation strategies, n8n workflows, and AI integration. 
                      No commitment required - just valuable insights for your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <a 
                        href={siteUrls.calendar || 'https://cal.iacovici.it'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group btn-primary inline-flex items-center hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        Book Your Free Slot
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </a>
                      <div className="text-sm text-gray-400">
                        <span className="inline-flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                          Usually available within 24 hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;