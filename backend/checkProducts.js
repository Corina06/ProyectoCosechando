require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

async function checkProducts() {
  try {
    const products = await Product.find({});
    console.log('Productos en la base de datos:');
    products.forEach(product => {
      console.log(`- ${product.name}: ${product.image}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error al consultar productos:', error);
    mongoose.connection.close();
  }
}

checkProducts();