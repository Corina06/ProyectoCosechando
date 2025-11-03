require('dotenv').config();
const mongoose = require('mongoose');

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
    process.exit(0);
  }
};

console.log('🧪 PRUEBA DE CONEXIÓN A MONGODB ATLAS');
console.log('=====================================');
testConnection();