// Script para insertar los datos de Ana en la base de datos
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const seedAna = async () => {
  try {
    console.log('🌱 Iniciando seed de datos de Ana...');
    
    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Verificar si Ana ya existe
    const existingAna = await User.findOne({ email: 'ana.gonzalez@cosechando.com' });
    
    if (existingAna) {
      console.log('ℹ️ Ana ya existe en la base de datos');
      console.log('📋 Datos actuales de Ana:');
      console.log({
        id: existingAna._id,
        nombre: existingAna.name,
        apellido: existingAna.apellido,
        email: existingAna.email,
        local: existingAna.local
      });
      
      // Actualizar datos de Ana si es necesario
      const updatedAna = await User.findByIdAndUpdate(
        existingAna._id,
        {
          name: 'Ana María',
          apellido: 'González Rodríguez',
          email: 'ana.gonzalez@cosechando.com',
          direccion: 'Calle 50, Bella Vista, Ciudad de Panamá',
          local: 'Local de Ana',
          puesto: 'Mercado Central, Puesto #15, Sección de Frutas y Verduras',
          celular: 65232563,
          fecha: new Date('1985-05-15'),
          banco: 'Banco Nacional de Panamá',
          tipo: 'Ahorro',
          cuenta: 4010123456789,
          foto: '/assets/images/comerciante-ana.jpg',
          estado: 'Activo',
          verificado: true,
          totalVentas: 1247.85,
          productosActivos: 16
          // No actualizar la contraseña si ya existe
        },
        { new: true }
      );
      
      console.log('✅ Datos de Ana actualizados');
      return updatedAna;
    }

    // Crear Ana si no existe
    const ana = new User({
      name: 'Ana María',
      apellido: 'González Rodríguez',
      email: 'ana.gonzalez@cosechando.com',
      direccion: 'Calle 50, Bella Vista, Ciudad de Panamá',
      local: 'Local de Ana',
      puesto: 'Mercado Central, Puesto #15, Sección de Frutas y Verduras',
      celular: 65232563,
      fecha: new Date('1985-05-15'),
      banco: 'Banco Nacional de Panamá',
      tipo: 'Ahorro',
      cuenta: 4010123456789,
      password: 'ana123', // Contraseña simple para pruebas
      foto: '/assets/images/comerciante-ana.jpg',
      estado: 'Activo',
      verificado: true,
      totalVentas: 1247.85,
      productosActivos: 16
    });

    await ana.save();
    console.log('✅ Ana creada exitosamente en la base de datos');
    console.log('📋 Datos de Ana:');
    console.log({
      id: ana._id,
      nombre: ana.name,
      apellido: ana.apellido,
      email: ana.email,
      local: ana.local,
      contraseña: 'ana123'
    });

    return ana;

  } catch (error) {
    console.error('❌ Error al crear datos de Ana:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedAna().then(() => {
    console.log('🎉 Proceso completado');
    process.exit(0);
  });
}

module.exports = { seedAna };