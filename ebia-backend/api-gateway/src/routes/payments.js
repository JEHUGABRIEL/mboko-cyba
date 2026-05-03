// api-gateway/src/routes/payments.js
// Initie un paiement Orange Money et gère le webhook de confirmation

import { Router } from 'express';
import { pool } from '../lib/db.js';
import crypto from 'crypto';
import axios from 'axios';

const router = Router();

const PLANS = {
  weekly:  { amount: 500,  days: 7,   label: '7 jours' },
  monthly: { amount: 1500, days: 30,  label: '30 jours' },
  yearly:  { amount: 15000, days: 365, label: '1 an' },
};

// POST /api/v1/payments/init — démarre un paiement Orange Money
router.post('/init', async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ error: 'Plan invalide' });

    const planData = PLANS[plan];
    const { rows: userRows } = await pool.query(
      'SELECT phone FROM users WHERE id = $1', [req.user.id]
    );
    if (!userRows.length) return res.status(404).json({ error: 'Utilisateur introuvable' });

    // Créer la transaction en base (status: pending)
    const { rows: payRows } = await pool.query(
      `INSERT INTO payments (user_id, amount_fcfa, plan, provider)
       VALUES ($1, $2, $3, 'orange_money')
       RETURNING id`,
      [req.user.id, planData.amount, plan]
    );
    const paymentId = payRows[0].id;

    // Appel Orange Money API
    // Doc: https://developer.orange.com/apis/orange-money-webpay-rca
    const omResponse = await axios.post(
      `${process.env.ORANGE_MONEY_URL}/webpayment`,
      {
        merchant_key: process.env.ORANGE_MERCHANT_KEY,
        currency: 'XAF',           // FCFA zone CEMAC
        order_id: paymentId,
        amount: planData.amount,
        return_url: 'https://e-bia.onrender.com/payment/success',
        cancel_url: 'https://e-bia.onrender.com/payment/cancel',
        notif_url: 'https://api.e-bia.app/webhooks/orange-money',
        lang: 'fr',
        reference: `EBIA-${plan.toUpperCase()}-${Date.now()}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ORANGE_CLIENT_SECRET}`,
          'Content-Type': 'application/json',
        },
        timeout: 10_000,
      }
    );

    // Mettre à jour le provider_tx_id
    await pool.query(
      'UPDATE payments SET provider_tx_id = $1 WHERE id = $2',
      [omResponse.data.pay_token, paymentId]
    );

    res.json({
      payment_url: omResponse.data.payment_url,  // Lien Orange Money à ouvrir
      pay_token:   omResponse.data.pay_token,
      amount_fcfa: planData.amount,
      plan:        planData.label,
    });

  } catch (err) {
    if (err.response) {
      console.error('[ORANGE MONEY]', err.response.data);
      return res.status(502).json({ error: 'Service Orange Money indisponible' });
    }
    next(err);
  }
});

// POST /webhooks/orange-money — appelé par Orange après paiement (sans auth JWT)
router.post('/webhook', (await import('express')).default.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    // Vérifier la signature Orange Money
    const signature = req.headers['x-orange-signature'];
    const expected = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(req.body)
      .digest('hex');

    if (signature !== expected) {
      return res.status(401).json({ error: 'Signature invalide' });
    }

    const body = JSON.parse(req.body);
    const { status, pay_token } = body;

    if (status === 'SUCCESS') {
      // Récupérer le paiement
      const { rows } = await pool.query(
        'SELECT id, user_id, plan FROM payments WHERE provider_tx_id = $1',
        [pay_token]
      );
      if (!rows.length) return res.status(404).json({ error: 'Paiement introuvable' });

      const { id: payId, user_id, plan } = rows[0];
      const days = PLANS[plan].days;
      const expiresAt = new Date(Date.now() + days * 86_400_000);

      // Activer l'abonnement
      await pool.query(
        `UPDATE payments SET status = 'success', confirmed_at = NOW() WHERE id = $1`,
        [payId]
      );
      await pool.query(
        `UPDATE users SET subscription = $1, sub_expires_at = $2 WHERE id = $3`,
        [plan, expiresAt, user_id]
      );

      console.log(`✅ Paiement confirmé — user ${user_id} → plan ${plan} jusqu'au ${expiresAt}`);
    }

    res.json({ received: true });
  } catch (err) { next(err); }
});

export default router;
