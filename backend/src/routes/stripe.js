const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { query } = require('../config/database');
const { sendPurchasedTemplateNotification } = require('../services/emailService');

// Create checkout session
router.post('/create-checkout', async (req, res) => {
  try {
    const { templateId, email } = req.body;
    
    // Fetch template details
    const templateResult = await query(
      'SELECT id, title, price FROM templates WHERE id = $1 AND is_pro = true',
      [templateId]
    );
    
    if (templateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found or not available for purchase' });
    }
    
    const template = templateResult.rows[0];
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: template.title,
              description: `n8n template: ${template.title}`,
            },
            unit_amount: Math.round(template.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/templates`,
      customer_email: email,
      metadata: {
        templateId: template.id,
        templateTitle: template.title,
      },
    });
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Record the purchase in the database
      const templateId = session.metadata.templateId;
      const email = session.customer_details.email;
      
      // Insert purchase record
      await query(
        'INSERT INTO template_downloads (template_id, email, download_type) VALUES ($1, $2, $3)',
        [templateId, email, 'purchased']
      );
      
      // Update download count
      await query(
        'UPDATE templates SET download_count = download_count + 1 WHERE id = $1',
        [templateId]
      );
      
      // Send purchase confirmation email
      const templateResult = await query(
        'SELECT title, price FROM templates WHERE id = $1',
        [templateId]
      );
      
      if (templateResult.rows.length > 0) {
        const template = templateResult.rows[0];
        const emailResult = await sendPurchasedTemplateNotification(
          email,
          template.title,
          template.price
        );
        
        if (!emailResult.success) {
          console.error('Failed to send purchase confirmation email:', emailResult.error);
        }
      }
      
      console.log('Purchase recorded for template:', templateId);
    } catch (err) {
      console.error('Error recording purchase:', err);
    }
  }

  res.json({ received: true });
});

// Verify payment success
router.get('/success', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      res.json({
        success: true,
        templateId: session.metadata.templateId,
        templateTitle: session.metadata.templateTitle,
        customerEmail: session.customer_details.email,
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;