require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

async function updateYucaImage() {
  try {
    // Buscar y actualizar la yuca
    const result = await Product.updateOne(
      { name: "Yuca" },
      { 
        $set: { 
          image: "https://cdn.pixabay.com/photo/2017/09/26/13/42/cassava-2788841_1280.jpg"
        }
      }
    );

    if (result.matchedCount > 0) {
      console.log('Imagen de yuca actualizada exitosamente');
    } else {
      console.log('No se encontró el producto yuca');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error al actualizar imagen de yuca:', error);
    mongoose.connection.close();
  }
}

updateYucaImage();