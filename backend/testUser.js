const mongoose = require('mongoose');

// Cambia 'tu_base_de_datos' al nombre de tu base de datos
mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {}).then(async () => {
  console.log('Connected to MongoDB');

  // Asegúrate de que la ruta al modelo sea correcta
  const User = require('./models/user'); 

  const newUser = new User({
    name: 'Ana',
    apellido: 'Lopez',
    email: 'analo@example.com',
    direccion: 'Test Address',
    local: 'Test Local',
    puesto: 'Test Puesto',
    celular: 123456789,
    fecha: new Date('2000-01-01'),
    banco: 'Test Bank',
    tipo: 'ahorro',
    cuenta: 123456789,
    password: 'password123',
  });

  try {
    await newUser.save();
    console.log('Usuario guardado exitosamente');
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('Could not connect to MongoDB:', err);
});
