
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user'); // Asegúrate de que el camino es correcto

const app = express();
//const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS
app.use(cors());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

//Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('API is running'); // Mensaje simple para verificar que el servidor está funcionando
});


// // Ruta para crear un nuevo usuario
// app.post('/users', async (req, res) => {
//   const user = new User(req.body);
//   try {
//     await user.save();
//     res.status(201).send(user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Ruta para obtener todos los usuarios
// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users); // Devuelve la lista de usuarios como JSON
//   } catch (error) {
//     res.status(500).send('Error al obtener usuarios');
//   }
// });

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});