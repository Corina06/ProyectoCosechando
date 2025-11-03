require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const sampleProducts = [
  {
    id: 1,
    name: "Manzanas Rojas",
    category: "Frutas",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
    description: "Manzanas rojas frescas y jugosas, perfectas para comer directamente o usar en postres.",
    location: "Chiriquí",
    CName: "Finca Los Robles",
    Contact: "6123-4567",
    stock: true,
    quantity: 50
  },
  {
    id: 2,
    name: "Tomates",
    category: "Verduras",
    price: 3.00,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
    description: "Tomates cherry dulces y frescos, ideales para ensaladas y aperitivos.",
    location: "Coclé",
    CName: "Huerto Verde",
    Contact: "6234-5678",
    stock: true,
    quantity: 30
  },
  {
    id: 3,
    name: "Lechuga Romana",
    category: "Verduras",
    price: 1.75,
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400",
    description: "Lechuga romana fresca y crujiente, perfecta para ensaladas César.",
    location: "Chiriquí",
    CName: "Granja San José",
    Contact: "6345-6789",
    stock: true,
    quantity: 25
  },
  {
    id: 4,
    name: "Guineos",
    category: "Frutas",
    price: 1.25,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    description: "Guineos maduros y dulces, ricos en potasio y perfectos para batidos.",
    location: "Colón",
    CName: "Plantación El Dorado",
    Contact: "6456-7890",
    stock: true,
    quantity: 100
  },
  {
    id: 5,
    name: "Zanahorias",
    category: "Raíces",
    price: 2.00,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
    description: "Zanahorias frescas y crujientes, ricas en vitamina A.",
    location: "Chiriquí",
    CName: "Finca La Esperanza",
    Contact: "6567-8901",
    stock: true,
    quantity: 40
  },
  {
    id: 6,
    name: "Frijoles Rojos",
    category: "Legumbres",
    price: 4.50,
    image: "https://afro-exotique.com/wp-content/uploads/2020/06/haricots_rouges_-_credit_zenia_nunez1.png",
    description: "Frijoles rojos secos, ricos en proteínas y fibra.",
    location: "Veraguas",
    CName: "Cooperativa Los Andes",
    Contact: "6678-9012",
    stock: true,
    quantity: 20
  },
  {
    id: 7,
    name: "Piñas",
    category: "Frutas",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400",
    description: "Piñas dulces y jugosas, perfectas para jugos y postres.",
    location: "Chiriquí",
    CName: "Tropical Fruits SA",
    Contact: "6789-0123",
    stock: true,
    quantity: 15
  },
  {
    id: 8,
    name: "Papas",
    category: "Raíces",
    price: 1.50,
    image: "https://saborusa.com.pa/imagesmg/imagenes/5ff3e6a0b703f_potatoes-food-supermarket-agriculture-JG7QGNY.jpg",
    description: "Papa fresca, perfecta para hervir, freír o hacer puré.",
    location: "Los Santos",
    CName: "Finca Tradicional",
    Contact: "6890-1234",
    stock: true,
    quantity: 60
  }
];

async function seedProducts() {
  try {
    // Limpiar productos existentes
    await Product.deleteMany({});
    console.log('Productos existentes eliminados');

    // Insertar productos de ejemplo
    await Product.insertMany(sampleProducts);
    console.log('Productos de ejemplo insertados exitosamente');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error al insertar productos:', error);
    mongoose.connection.close();
  }
}

seedProducts();