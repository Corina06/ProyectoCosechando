
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user'); 
//const Stripe = require('stripe');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//const stripe = new Stripe('TU_SECRET_KEY_DE_STRIPE');

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

//Rutas

app.use('/api/auth', authRoutes);

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('API is running'); // Mensaje simple para verificar que el servidor está funcionando
});

//Pago
//app.post('/api/create-payment-intent', async (req, res) => {
  //const { amount } = req.body;

  //try {
   // const paymentIntent = await stripe.paymentIntents.create({
    //  amount,
      //currency: 'usd',
   // });
    //res.send({ clientSecret: paymentIntent.client_secret });
  //} catch (error) {
   // res.status(500).send({ error: error.message });
 // }
//});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});