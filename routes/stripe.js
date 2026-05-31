const express = require('express');
const router = express.Router();
const db = require('../database/db');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const MEMBERSHIP_TIERS = {
  ally: { monthly: 1000, yearly: 10000, name: 'Ally' },
  advocate: { monthly: 2500, yearly: 25000, name: 'Advocate' },
  champion: { monthly: 7500, yearly: 75000, name: 'Champion' },
  institutional: { monthly: 25000, yearly: 250000, name: 'Institutional Partner' },
  founding: { monthly: 100000, yearly: 1000000, name: 'Founding Member' }
};

router.post('/create-checkout', async (req, res) => {
  const { tier, billing, email, name } = req.body;
  const tierData = MEMBERSHIP_TIERS[tier];

  if (!tierData) {
    return res.status(400).json({ error: 'Invalid membership tier.' });
  }

  try {
    const sessionConfig = {
      payment_method_types: ['card'],
      mode: 'subscription',
      metadata: { tier, name: name || '' },
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `AHG ${tierData.name} Membership`,
            description: `Almost Human Group — ${tierData.name} Tier`
          },
          unit_amount: billing === 'yearly' ? tierData.yearly : tierData.monthly,
          recurring: { interval: billing === 'yearly' ? 'year' : 'month' }
        },
        quantity: 1
      }],
      success_url: `${process.env.BASE_URL}/membership?success=true&tier=${tier}`,
      cancel_url: `${process.env.BASE_URL}/membership?canceled=true`
    };
    if (email) sessionConfig.customer_email = email;

    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Payment processing error. Please try again.' });
  }
});

router.post('/create-founding-checkout', async (req, res) => {
  const { email, name } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      metadata: { tier: 'founding-member-10', name },
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AHG Founding Member',
            description: 'Almost Human Group — Founding Member at $10/month'
          },
          unit_amount: 1000,
          recurring: { interval: 'month' }
        },
        quantity: 1
      }],
      success_url: `${process.env.BASE_URL}/founding-members?success=true`,
      cancel_url: `${process.env.BASE_URL}/founding-members?canceled=true`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Payment processing error. Please try again.' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { tier, name } = session.metadata;

      if (tier === 'founding-member-10') {
        db.prepare(`INSERT OR REPLACE INTO founding_members (email, name, type, stripe_customer_id, stripe_subscription_id) VALUES (?, ?, 'paid', ?, ?)`)
          .run(session.customer_email, name, session.customer, session.subscription);
      } else {
        db.prepare(`INSERT OR REPLACE INTO members (email, name, tier, stripe_customer_id, stripe_subscription_id, status) VALUES (?, ?, ?, ?, ?, 'active')`)
          .run(session.customer_email, name, tier, session.customer, session.subscription);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;
