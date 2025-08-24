import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto container-padding">
        <Link to="/" className="inline-flex items-center text-accent-gold hover:text-accent-gold/80 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="card">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Cookies Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6"><strong>Last Updated:</strong> August 24, 2025</p>
            
            <p className="text-gray-300 mb-6">
              This Cookies Policy explains what cookies are, how we use them, and your choices regarding cookies 
              when you use our website. Please read this policy carefully.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
            
            <p className="text-gray-300 mb-4">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to the owners 
              of the site.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
            
            <p className="text-gray-300 mb-4">
              We use cookies to enhance your experience on our website and to understand how visitors interact with 
              our content. The cookies we use are categorized as follows:
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
            <p className="text-gray-300 mb-4">
              These cookies are necessary for the website to function and cannot be switched off in our systems. 
              They are usually only set in response to actions made by you which amount to a request for services, 
              such as setting your privacy preferences, logging in or filling in forms.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Performance Cookies</h3>
            <p className="text-gray-300 mb-4">
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance 
              of our site. They help us to know which pages are the most and least popular and see how visitors move 
              around the site.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Functionality Cookies</h3>
            <p className="text-gray-300 mb-4">
              These cookies enable the website to provide enhanced functionality and personalization. They may be 
              set by us or by third party providers whose services we have added to our pages.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Third-Party Cookies</h2>
            
            <p className="text-gray-300 mb-4">
              We may use third-party services that use cookies to collect information about your online activities 
              across different websites. These services include:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li><strong>Analytics:</strong> Google Analytics to understand how visitors use our website</li>
              <li><strong>Marketing:</strong> Social media platforms for advertising and retargeting purposes</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Managing Cookies</h2>
            
            <p className="text-gray-300 mb-4">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your 
              computer and you can set most browsers to prevent them from being placed. If you do this, however, you 
              may have to manually adjust some preferences every time you visit a site and some services and 
              functionalities may not work.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to This Cookies Policy</h2>
            
            <p className="text-gray-300 mb-4">
              We may update our Cookies Policy from time to time. We will notify you of any changes by posting the 
              new Cookies Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
            
            <p className="text-gray-300 mb-4">
              If you have any questions about this Cookies Policy, please contact us:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Email: privacy@iacovici.it</li>
              <li>Address: [Your Business Address]</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;