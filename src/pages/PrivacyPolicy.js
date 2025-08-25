import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCompanyInfo, useContactInfo, useSiteSettings } from '../hooks/useSiteSettings';

const PrivacyPolicy = () => {
  const companyInfo = useCompanyInfo();
  const contactInfo = useContactInfo();
  const { settings } = useSiteSettings();
  
  const formatAddress = (address) => {
    if (typeof address === 'string') return address;
    if (typeof address === 'object' && address) {
      return `${address.street}, ${address.city}, ${address.country} ${address.zip}`;
    }
    return 'Via Roma 123, Milan, Italy 20100';
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto container-padding">
        <Link to="/" className="inline-flex items-center text-accent-gold hover:text-accent-gold/80 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="card">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6"><strong>Last Updated:</strong> {settings.privacy_policy_last_updated || 'August 24, 2025'}</p>
            
            <p className="text-gray-300 mb-6">
              At {companyInfo.name}, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit 
              our website and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Important Information and Who We Are</h2>
            
            <p className="text-gray-300 mb-4">
              <strong>Purpose of this privacy policy:</strong> This privacy policy aims to give you information 
              on how {companyInfo.name} collects and processes your personal data through your use of this website, 
              including any data you may provide through contact forms or when purchasing services.
            </p>
            
            <p className="text-gray-300 mb-4">
              This website is not intended for children and we do not knowingly collect data relating to children.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. The Data We Collect About You</h2>
            
            <p className="text-gray-300 mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have 
              grouped together as follows:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li><strong>Identity Data</strong> including first name, last name, username or similar identifier</li>
              <li><strong>Contact Data</strong> including billing address, delivery address, email address and telephone numbers</li>
              <li><strong>Technical Data</strong> including internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website</li>
              <li><strong>Usage Data</strong> including information about how you use our website, products and services</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Collect Your Personal Data</h2>
            
            <p className="text-gray-300 mb-4">
              We use different methods to collect data from and about you including through:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li><strong>Direct interactions.</strong> You may give us your Identity, Contact and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise.</li>
              <li><strong>Automated technologies or interactions.</strong> As you interact with our website, we may automatically collect Technical Data about your equipment, browsing actions and patterns.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. How We Use Your Personal Data</h2>
            
            <p className="text-gray-300 mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your 
              personal data in the following circumstances:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
              <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests</li>
              <li>Where we need to comply with a legal or regulatory obligation</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
            
            <p className="text-gray-300 mb-4">
              We have put in place appropriate security measures to prevent your personal data from being 
              accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
            
            <p className="text-gray-300 mb-4">
              We will only retain your personal data for as long as necessary to fulfil the purposes we collected 
              it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Legal Rights</h2>
            
            <p className="text-gray-300 mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            
            <p className="text-gray-300 mb-4">
              If you have any questions about this privacy policy or our privacy practices, please contact us:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Email: {contactInfo.email}</li>
              <li>Address: {formatAddress(contactInfo.address)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;