require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const listUsers = async () => {
  try {
    console.log('👥 LISTANDO USUARIOS REGISTRADOS');
    console.log('================================');
    
    await mongoose.connect(process.env.MONGO_URI);
    
    // Obtener todos los usuarios
    const users = await User.find({}, '-password'); // Excluir contraseñas por seguridad
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios registrados');
      return;
    }
    
    console.log(`✅ Total de usuarios: ${users.length}`);
    console.log('');
    
    users.forEach((user, index) => {
      console.log(`👤 USUARIO ${index + 1}:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Nombre: ${user.name} ${user.apellido}`);
      console.log(`   📍 Dirección: ${user.direccion}`);
      console.log(`   🏪 Local: ${user.local}`);
      console.log(`   📱 Celular: ${user.celular}`);
      console.log(`   🏦 Banco: ${user.banco} (${user.tipo})`);
      console.log(`   📅 Registrado: ${user.createdAt || 'No disponible'}`);
      console.log(`   🆔 ID: ${user._id}`);
      console.log('   ─────────────────────────────');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

listUsers();