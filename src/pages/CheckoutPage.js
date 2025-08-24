import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader,
  XCircle
} from 'lucide-react';
import { createCheckoutSession, verifyPaymentSuccess } from '../utils/api';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { template } = location.state || {};
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'error', 'idle', 'verifying'
  const [formData, setFormData] = useState({
    email: '',
  });
  const [error, setError] = useState('');
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    // If no template is provided, redirect to templates page
    if (!template) {
      navigate('/templates');
    }
    
    // Check for successful payment redirect
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId && paymentStatus !== 'success') {
      verifyPaymentSuccess(sessionId)
        .then(data => {
          if (data.success) {
            setPaymentStatus('success');
          } else {
            setVerificationError(data.error || 'Payment verification failed');
            setPaymentStatus('error');
          }
        })
        .catch(err => {
          console.error('Payment verification error:', err);
          setVerificationError(err.message || 'Failed to verify payment. Please contact support.');
          setPaymentStatus('error');
        });
    }
  }, [template, navigate, paymentStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setPaymentStatus('idle');

    try {
      // Create Stripe checkout session
      const response = await createCheckoutSession(template.id, formData.email);
      
      // Redirect to Stripe checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
      setPaymentStatus('error');
      setIsProcessing(false);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto container-padding">
          <Link to="/templates" className="inline-flex items-center text-accent-gold hover:text-accent-gold/80 mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Templates
          </Link>
          
          <div className="card text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Template Not Found</h2>
            <p className="text-gray-400 mb-6">
              The template you're trying to purchase could not be found.
            </p>
            <Link to="/templates" className="btn-primary">
              Browse Templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto container-padding">
        <Link to="/templates" className="inline-flex items-center text-accent-gold hover:text-accent-gold/80 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Templates
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <div className="card mb-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="flex items-start mb-6">
                <div className="bg-primary-dark rounded-lg p-3 mr-4">
                  <ShoppingCart className="w-8 h-8 text-accent-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{template.title}</h3>
                  <p className="text-gray-400 text-sm">{template.description}</p>
                  <div className="mt-2">
                    <span className="text-accent-gold font-bold text-xl">€{template.price}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>€{template.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>€0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-700">
                  <span>Total</span>
                  <span>€{template.price}</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="font-semibold mb-4">Secure Payment</h3>
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 mr-2 text-accent-gold" />
                <span>Your payment details are encrypted and securely processed by Stripe</span>
              </div>
            </div>
          </div>
          
          {/* Payment Form */}
          <div>
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
              
              {paymentStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                  <p className="text-gray-400 mb-6">
                    Thank you for your purchase. You'll receive a confirmation email shortly with download instructions.
                  </p>
                  <div className="space-y-4">
                    <Link to="/templates" className="btn-primary w-full">
                      Download Template
                    </Link>
                    <Link to="/" className="btn-secondary w-full">
                      Return to Home
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {(error || verificationError) && (
                    <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Payment Error</p>
                        <p>{error || verificationError}</p>
                      </div>
                    </div>
                  )}
                  
                  {paymentStatus === 'error' && !error && !verificationError && (
                    <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      There was an error processing your payment. Please try again.
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className={`form-input w-full ${error ? 'border-red-500' : ''}`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      We'll send your template download link to this email
                    </p>
                  </div>
                  
                  <div className="bg-primary-dark rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-accent-gold mr-2" />
                        <span className="font-medium">Pay with Card</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-gray-600 rounded-sm"></div>
                        <div className="w-8 h-5 bg-gray-600 rounded-sm"></div>
                        <div className="w-8 h-5 bg-gray-600 rounded-sm"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      You'll be redirected to Stripe's secure payment page to complete your purchase.
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full btn-primary text-lg py-4 flex items-center justify-center ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Pay €{template.price}
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-sm text-gray-400">
                    By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;