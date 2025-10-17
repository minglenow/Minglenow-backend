
import { Router } from 'express';
import Stripe from 'stripe';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import express from 'express';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: '2024-11-01' });

// Create Checkout Session (web)
router.post('/create-checkout', async (req, res) => {
  try {
    const { userId, priceId, successUrl, cancelUrl } = req.body;
    if (!userId || !priceId) return res.status(400).json({ error: 'Missing parameters' });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId },
      success_url: successUrl || ${process.env.FRONTEND_URL}/success,
      cancel_url: cancelUrl || ${process.env.FRONTEND_URL}/cancel,
    });
    res.json({ url: session.url, id: session.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(Webhook Error: ${err.message});
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        if (userId) {
          const repo = getRepository(User);
          const user = await repo.findOne({ where: { id: userId } });
          if (user) {
            // Simple: add 30 days. Production: use subscription lifecycle events.
            const vipDays = 30;
            user.vip_until = new Date(Date.now() + vipDays * 24 * 60 * 60 * 1000);
            await repo.save(user);
          }
        }
        break;
      }
      case 'invoice.payment_failed': {
        // handle failed payments: notify user, mark subscription
        break;
      }
      // handle other events as needed
      default:
        break;
    }
    res.json({ received: true });
  } catch (err: any) {
    console.error('Error handling webhook', err.message);
    res.status(500).send();
  }
});

export default router;