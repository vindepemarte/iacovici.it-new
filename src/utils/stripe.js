// Stripe integration for pro template purchases
import { loadStripe } from '@stripe/stripe-js';
import { API_BASE_URL } from './api';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

/**
 * Create a Stripe checkout session for a template purchase
 * @param {number} templateId - The template ID to purchase
 * @param {string} email - Customer email
 * @returns {Promise} - Redirect to Stripe checkout or error
 */
export const createCheckoutSession = async (templateId, email) => {
  try {
    // Call our backend API to create a Stripe checkout session
    const response = await fetch(`${API_BASE_URL}/payments/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId,
        email
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Handle successful payment (called from success page)
 * @param {string} sessionId - Stripe session ID
 * @returns {Promise} - Purchase details
 */
export const handleSuccessfulPayment = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/success?session_id=${sessionId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify payment');
    }

    const paymentDetails = await response.json();
    return paymentDetails;
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
};

/**
 * Validate Stripe configuration
 * @returns {boolean} - True if Stripe is properly configured
 */
export const validateStripeConfig = () => {
  const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.warn('Stripe publishable key not found in environment variables');
    return false;
  }
  
  if (!publishableKey.startsWith('pk_')) {
    console.warn('Invalid Stripe publishable key format');
    return false;
  }
  
  return true;
};

/**
 * Format price for display
 * @param {number} price - Price in euros
 * @param {string} currency - Currency code (default: EUR)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = 'EUR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

// Error messages for different scenarios
export const STRIPE_ERRORS = {
  CARD_DECLINED: 'Your card was declined.',
  INSUFFICIENT_FUNDS: 'Your card has insufficient funds.',
  EXPIRED_CARD: 'Your card has expired.',
  PROCESSING_ERROR: 'An error occurred while processing your payment.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INVALID_CVC: 'Your card\'s security code is invalid.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

/**
 * Handle Stripe errors and return user-friendly messages
 * @param {Object} error - Stripe error object
 * @returns {string} - User-friendly error message
 */
export const handleStripeError = (error) => {
  if (!error) return STRIPE_ERRORS.GENERIC_ERROR;
  
  // Handle Stripe API errors
  if (error.type === 'card_error') {
    switch (error.code) {
      case 'card_declined':
        return STRIPE_ERRORS.CARD_DECLINED;
      case 'insufficient_funds':
        return STRIPE_ERRORS.INSUFFICIENT_FUNDS;
      case 'expired_card':
        return STRIPE_ERRORS.EXPIRED_CARD;
      case 'invalid_cvc':
        return STRIPE_ERRORS.INVALID_CVC;
      default:
        return STRIPE_ERRORS.GENERIC_ERROR;
    }
  }
  
  // Handle network errors
  if (error.message && error.message.includes('network')) {
    return STRIPE_ERRORS.NETWORK_ERROR;
  }
  
  // Handle processing errors
  if (error.type === 'api_error' || error.type === 'idempotency_error') {
    return STRIPE_ERRORS.PROCESSING_ERROR;
  }
  
  return STRIPE_ERRORS.GENERIC_ERROR;
};

export default {
  createCheckoutSession,
  handleSuccessfulPayment,
  validateStripeConfig,
  formatPrice,
  handleStripeError,
  STRIPE_ERRORS
};