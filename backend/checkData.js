require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');

const checkData = async () => {
  try {
    console.log('🔍 Verificando datos en MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGO_URI);
    
    // Contar documentos
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    console.log('');
    console.log('📊 RESUMEN DE DATOS:');
    console.log('─'.repeat(30));
    console.log(`👥 Usuarios: ${userCount}`);
    console.log(`📦 Productos: ${productCount}`);
    console.log(`📋 Órdenes: ${orderCount}`);
    
    if (productCount > 0) {
      console.log('');
      console.log('📦 PRODUCTOS DISPONIBLES:');
      const products = await Product.find().limit(5);
      products.forEach(product => {
        console.log(`   • ${product.name} - $${product.price}`);
      });
      if (productCount > 5) {
        console.log(`   ... y ${productCount - 5} más`);
      }
    }
    
    if (orderCount > 0) {
      console.log('');
      console.log('📋 ÓRDENES RECIENTES:');
      const orders = await Order.find().sort({ createdAt: -1 }).limit(3);
      orders.forEach(order => {
        console.log(`   • ${order.orderNumber} - $${order.total} (${order.status})`);
      });
    }
    
    console.log('');
    if (userCount === 0 && productCount === 0 && orderCount === 0) {
      console.log('⚠️  Base de datos vacía - ejecuta los scripts de seed');
    } else {
      console.log('✅ Base de datos poblada correctamente');
    }
    
  } catch (error) {
    console.error('❌ Error verificando datos:', error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

checkData();