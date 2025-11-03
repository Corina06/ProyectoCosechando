require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const updateTestUser = async () => {
  try {
    console.log('🔄 Actualizando usuario de prueba...');
    
    await mongoose.connect(process.env.MONGO_URI);
    
    // Buscar y eliminar el usuario existente
    await User.deleteOne({ email: 'test@cosechando.com' });
    console.log('🗑️ Usuario anterior eliminado');
    
    // Crear nuevo usuario con la contraseña solicitada
    const testUser = new User({
      name: 'Usuario Prueba',
      apellido: 'Cosechando',
      email: 'test@cosechando.com',
      direccion: 'Ciudad de Panamá, Panamá',
      local: 'Puesto de Prueba',
      puesto: 'Mercado Central',
      celular: 12345678,
      fecha: new Date('1990-01-01'),
      banco: 'Banco Nacional',
      tipo: 'ahorro',
      cuenta: 1234567890,
      password: 'cosechando24'
    });
    
    await testUser.save();
    
    console.log('✅ Usuario actualizado exitosamente!');
    console.log('');
    console.log('📋 NUEVOS DATOS PARA INICIAR SESIÓN:');
    console.log('📧 Email: test@cosechando.com');
    console.log('🔐 Contraseña: cosechando24');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateTestUser();