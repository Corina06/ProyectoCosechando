require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const createTestUser = async () => {
  try {
    console.log('🔄 Creando usuario de prueba...');
    
    await mongoose.connect(process.env.MONGO_URI);
    
    // Verificar si ya existe un usuario de prueba
    const existingUser = await User.findOne({ email: 'test@cosechando.com' });
    if (existingUser) {
      console.log('✅ Usuario de prueba ya existe:');
      console.log('📧 Email: test@cosechando.com');
      console.log('🔐 Contraseña: 123456');
      process.exit(0);
    }
    
    // Crear usuario de prueba
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
      password: '123456'
    });
    
    await testUser.save();
    
    console.log('✅ Usuario de prueba creado exitosamente!');
    console.log('');
    console.log('📋 DATOS PARA INICIAR SESIÓN:');
    console.log('📧 Email: test@cosechando.com');
    console.log('🔐 Contraseña: 123456');
    console.log('');
    console.log('🌐 Ve a: http://localhost:4200/login');
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createTestUser();