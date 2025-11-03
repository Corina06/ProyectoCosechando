require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

async function updateRootProduct() {
  try {
    // Reemplazar la yuca con ñame
    const result = await Product.updateOne(
      { name: "Papas" },
      { 
        $set: { 
          name: "Papas",
          image: "https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Papas+Frescas",
          description: "Papas frescas, versátiles para freír, hervir o hacer puré.",
          price: 1.80
        }
      }
    );

    if (result.matchedCount > 0) {
      console.log('Producto actualizado de Yuca a Ñame exitosamente');
    } else {
      console.log('No se encontró el producto yuca para actualizar');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    mongoose.connection.close();
  }
}

updateRootProduct();