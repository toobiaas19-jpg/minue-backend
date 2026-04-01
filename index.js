const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/crear-pago', async (req, res) => {
  try {
    const { items } = req.body;
    const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

    const mpItems = items.map(item => ({
      title: item.nombre,
      quantity: item.qty,
      unit_price: item.precio,
      currency_id: 'ARS'
    }));

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: mpItems,
        back_urls: {
          success: 'https://alfajoresminue.netlify.app/',
          failure: 'https://alfajoresminue.netlify.app/',
          pending: 'https://alfajoresminue.netlify.app/'
        },
        auto_return: 'approved',
        statement_descriptor: 'MINUE Alfajores'
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data });

    res.json({
      init_point: data.init_point,
      mobile_init_point: data.mobile_init_point
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
