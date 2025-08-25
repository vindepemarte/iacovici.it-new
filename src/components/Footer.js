import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Github, Linkedin, ArrowUp } from 'lucide-react';
import { useCompanyInfo, useContactInfo, useSocialLinks } from '../hooks/useSiteSettings';

const Footer = () => {
  const companyInfo = useCompanyInfo();
  const contactInfo = useContactInfo();
  const socialLinks = useSocialLinks();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Services': [
      { name: 'n8n Automation', href: '/services#n8n' },
      { name: 'AI Solutions', href: '/services#ai' },
      { name: 'Frontend Development', href: '/services#frontend' },
      { name: 'Server Management', href: '/services#servers' },
    ],
    'Resources': [
      { name: 'Free Templates', href: '/templates' },
      { name: 'Blog', href: '/blog' },
      { name: 'Tutorials', href: '/blog' },
      { name: 'Documentation', href: '/blog' },
    ],
    'Company': [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Cookies Policy', href: '/cookies-policy' },
    ],
  };

  return (
    <footer className="bg-black text-primary-light">
      <div className="max-w-7xl mx-auto container-padding section-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="/logos/ia-logo-small-light.png" 
                alt={`${companyInfo.name} Logo`}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {companyInfo.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href={`mailto:${contactInfo.email}`}
                className="flex items-center space-x-2 text-gray-400 hover:text-accent-gold transition-colors duration-300"
              >
                <Mail size={16} />
                <span className="text-sm">{contactInfo.email}</span>
              </a>
              {socialLinks.telegram && (
                <a 
                  href={socialLinks.telegram}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-accent-gold transition-colors duration-300"
                >
                  <MessageCircle size={16} />
                  <span className="text-sm">{companyInfo.name} Group</span>
                </a>
              )}
              {socialLinks.github && (
                <a 
                  href={socialLinks.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-accent-gold transition-colors duration-300"
                >
                  <Github size={16} />
                  <span className="text-sm">GitHub Profile</span>
                </a>
              )}
              {socialLinks.linkedin && (
                <a 
                  href={socialLinks.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-accent-gold transition-colors duration-300"
                >
                  <Linkedin size={16} />
                  <span className="text-sm">LinkedIn Profile</span>
                </a>
              )}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-primary-light mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-accent-gold transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} {companyInfo.name}. All rights reserved.
          </div>
          
          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-gray-400 hover:text-accent-gold transition-colors duration-300 text-sm"
          >
            <span>Back to Top</span>
            <ArrowUp size={16} />
          </button>
        </div>

        {/* Additional Legal Info */}
        <div className="border-t border-gray-800 mt-6 pt-6">
          <p className="text-xs text-gray-500 text-center">
            {companyInfo.name} is a technology consulting company specializing in automation and AI solutions. 
            All trademarks and registered trademarks are the property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;