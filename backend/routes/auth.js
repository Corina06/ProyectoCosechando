// routes/auth.js
const express = require('express');
const User = require('../models/user');
//const jwt = require('jsonwebtoken'); // Para manejar tokens JWT
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  console.log('Datos recibidos:', req.body); // Agrega esta línea 

  const { name, apellido, email, direccion, local, puesto, celular, fecha, banco, tipo, cuenta, password } = req.body;
   // Verificar si el usuario ya existe

   
   const existingUser = await User.findOne({ email });
   if (existingUser) {
     return res.status(400).json({ message: 'El usuario ya existe' });
   }
 
   // Crear nuevo usuario
   const newUser = new User({
     name,
     apellido,
     email,
     direccion,
     local,
     puesto,
     celular,
     fecha,
     banco,
     tipo,
     cuenta,
     password,
   });
 
   try{
     await newUser.save(); // Guardar en la base de datos
     res.status(201).json({ message: 'Usuario registrado exitosamente' });
   } catch (error) {
     console.error('Error al registrar usuario:', error);
     res.status(500).json({ message: 'Error en el registro', details: error.message });
   }
 });

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
   
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verifica la contraseña (asegúrate de que estés utilizando bcrypt para comparar)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }
    // No enviar token
    res.status(200).json({ message: 'Login exitoso', user });

  } catch (error) {
    res.status(400).send({ error: 'Error en Login' });
  }
});

module.exports = router;
