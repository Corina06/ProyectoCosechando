require('dotenv').config();
const mongoose = require('mongoose');

// Modelos
const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');

const migrateData = async () => {
  try {
    console.log('🔄 Iniciando migración de datos a la nube...');
    
    // Conectar a base de datos local
    console.log('📡 Conectando a base de datos local...');
    const localConnection = await mongoose.createConnection('mongodb://localhost:27017/cosechando');
    
    // Conectar a base de datos en la nube
    console.log('☁️ Conectando a base de datos en la nube...');
    const cloudUri = process.env.MONGO_URI;
    
    const cloudConnection = await mongoose.createConnection(cloudUri);
    
    // Obtener modelos para ambas conexiones
    const LocalUser = localConnection.model('User', User.schema);
    const LocalProduct = localConnection.model('Product', Product.schema);
    const LocalOrder = localConnection.model('Order', Order.schema);
    
    const CloudUser = cloudConnection.model('User', User.schema);
    const CloudProduct = cloudConnection.model('Product', Product.schema);
    const CloudOrder = cloudConnection.model('Order', Order.schema);
    
    // Migrar usuarios
    console.log('👥 Migrando usuarios...');
    const users = await LocalUser.find();
    if (users.length > 0) {
      await CloudUser.deleteMany({}); // Limpiar datos existentes
      await CloudUser.insertMany(users);
      console.log(`✅ ${users.length} usuarios migrados`);
    }
    
    // Migrar productos
    console.log('📦 Migrando productos...');
    const products = await LocalProduct.find();
    if (products.length > 0) {
      await CloudProduct.deleteMany({});
      await CloudProduct.insertMany(products);
      console.log(`✅ ${products.length} productos migrados`);
    }
    
    // Migrar órdenes
    console.log('📋 Migrando órdenes...');
    const orders = await LocalOrder.find();
    if (orders.length > 0) {
      await CloudOrder.deleteMany({});
      await CloudOrder.insertMany(orders);
      console.log(`✅ ${orders.length} órdenes migradas`);
    }
    
    console.log('🎉 ¡Migración completada exitosamente!');
    console.log('💡 Ahora puedes cambiar MONGO_URI en .env para usar la base de datos en la nube');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
};

// Verificar configuración
const cloudUri = process.env.MONGO_URI;
const isAtlasConfigured = cloudUri && cloudUri.includes('mongodb+srv://');

if (!isAtlasConfigured) {
  console.log('📋 CONFIGURACIÓN REQUERIDA:');
  console.log('');
  console.log('❌ MongoDB Atlas no está configurado');
  console.log('💡 Ejecuta primero: node setupAtlas.js');
  console.log('');
  console.log('O configura manualmente MONGO_URI en .env con tu URL de Atlas');
  process.exit(0);
}

migrateData();