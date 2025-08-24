import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto container-padding">
        <Link to="/" className="inline-flex items-center text-accent-gold hover:text-accent-gold/80 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="card">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6"><strong>Last Updated:</strong> August 24, 2025</p>
            
            <p className="text-gray-300 mb-6">
              These Terms of Service govern your access to and use of the services, websites, and applications 
              offered by Iacovici.it. Please read these terms carefully before using our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            
            <p className="text-gray-300 mb-4">
              By accessing or using our services, you agree to be bound by these Terms of Service and all applicable 
              laws and regulations. If you do not agree with any of these terms, you are prohibited from using or 
              accessing our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Services</h2>
            
            <p className="text-gray-300 mb-4">
              Iacovici.it provides automation solutions, AI integration services, frontend development, and server 
              management services. Our services include but are not limited to:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>n8n workflow automation templates and implementation</li>
              <li>Artificial intelligence integration and solutions</li>
              <li>Custom web application development</li>
              <li>Server setup and management with Coolify</li>
              <li>Technical consulting and support</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Responsibilities</h2>
            
            <p className="text-gray-300 mb-4">
              You are responsible for maintaining the confidentiality of your account and password and for 
              restricting access to your computer or device. You agree to accept responsibility for all activities 
              that occur under your account or password.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
            
            <p className="text-gray-300 mb-4">
              All content, features, and functionality on our website and in our services, including but not limited 
              to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and 
              software, are the exclusive property of Iacovici.it or its licensors and are protected by international 
              copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Payment Terms</h2>
            
            <p className="text-gray-300 mb-4">
              You agree to pay all fees and charges associated with your account or services in accordance with 
              the pricing and payment terms presented to you for such services. All fees are exclusive of taxes, 
              and you are responsible for paying any applicable taxes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
            
            <p className="text-gray-300 mb-4">
              In no event shall Iacovici.it, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Your access to or use of or inability to access or use the services</li>
              <li>Any conduct or content of any third party on the services</li>
              <li>Any content obtained from the services</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
            
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your access to all or any part of the services at any time, with or without 
              cause, with or without notice, effective immediately.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
            
            <p className="text-gray-300 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
              revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Information</h2>
            
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Email: legal@iacovici.it</li>
              <li>Address: [Your Business Address]</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;