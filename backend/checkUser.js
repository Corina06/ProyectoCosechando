require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const checkUser = async () => {
  try {
    console.log('🔍 Verificando usuario de prueba...');
    
    await mongoose.connect(process.env.MONGO_URI);
    
    // Buscar el usuario de prueba
    const user = await User.findOne({ email: 'test@cosechando.com' });
    
    if (!user) {
      console.log('❌ Usuario de prueba no encontrado');
      return;
    }
    
    console.log('✅ Usuario encontrado:');
    console.log('📧 Email:', user.email);
    console.log('👤 Nombre:', user.name, user.apellido);
    console.log('🆔 ID:', user._id);
    console.log('🔐 Password hash:', user.password.substring(0, 20) + '...');
    
    // Probar la verificación de contraseña
    console.log('');
    console.log('🧪 Probando verificación de contraseña...');
    const isMatch = await user.comparePassword('123456');
    console.log('🔑 Contraseña "123456" es correcta:', isMatch);
    
    if (!isMatch) {
      console.log('❌ La contraseña no coincide. Recreando usuario...');
      
      // Eliminar usuario existente
      await User.deleteOne({ email: 'test@cosechando.com' });
      
      // Crear nuevo usuario
      const newUser = new User({
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
      
      await newUser.save();
      console.log('✅ Usuario recreado exitosamente');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkUser();