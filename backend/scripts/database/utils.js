require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../../models/user');
const Product = require('../../models/product');
const Order = require('../../models/order');

// Función para probar conexión
const testConnection = async () => {
  try {
    console.log('🔄 Probando conexión a MongoDB...');
    console.log(`📍 URI: ${process.env.MONGO_URI?.substring(0, 50)}...`);
    
    const connection = await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
    console.log(`📊 Base de datos: ${connection.connection.name}`);
    console.log(`🌐 Host: ${connection.connection.host}`);
    console.log(`📡 Estado: ${connection.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
    
    // Probar una operación simple
    const collections = await connection.connection.db.listCollections().toArray();
    console.log(`📁 Colecciones encontradas: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Colecciones:');
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    console.log('');
    console.log('🎉 ¡Todo funciona correctamente!');
    console.log('💡 Tu aplicación está lista para usar MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('');
    console.log('🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verifica que la cadena de conexión sea correcta');
    console.log('2. Asegúrate de que el usuario y contraseña sean correctos');
    console.log('3. Confirma que las IPs estén configuradas (0.0.0.0/0)');
    console.log('4. Verifica que el cluster esté activo en MongoDB Atlas');
  } finally {
    await mongoose.disconnect();
  }
};

// Función para verificar datos
const checkData = async () => {
  try {
    console.log('🔍 Verificando datos en MongoDB...');
    
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
        console.log(`   • ${product.name} - ${product.price}`);
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
        console.log(`   • ${order.orderNumber} - ${order.total} (${order.status})`);
      });
    }
    
    console.log('');
    if (userCount === 0 && productCount === 0 && orderCount === 0) {
      console.log('⚠️  Base de datos vacía - ejecuta los scripts de seed');
    } else {
      console.log('✅ Base de datos poblada correctamente');
    }
    
  } catch (error) {
    console.error('❌ Error verificando datos:', error