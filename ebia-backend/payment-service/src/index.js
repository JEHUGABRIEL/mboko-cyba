// payment-service/src/index.js
// Microservice léger — délègue la logique Orange Money à l'API Gateway
// Ce service peut être étendu pour Moov Money, Wave, etc.

import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'payment-service' }));

app.get('/plans', (_, res) => {
  res.json({
    plans: [
      { id: 'weekly',  label: 'Hebdomadaire', amount_fcfa: 500,   days: 7,   popular: false },
      { id: 'monthly', label: 'Mensuel',       amount_fcfa: 1500,  days: 30,  popular: true  },
      { id: 'yearly',  label: 'Annuel',        amount_fcfa: 15000, days: 365, popular: false },
    ]
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log('💰 E-Bia Payment Service → port', process.env.PORT || 5000);
});
