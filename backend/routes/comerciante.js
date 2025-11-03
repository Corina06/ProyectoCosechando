const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  changePassword, 
  uploadProfilePhoto 
} = require('../controllers/comercianteController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener perfil del comerciante
router.get('/profile', getProfile);

// Actualizar perfil del comerciante
router.put('/profile', updateProfile);

// Cambiar contraseña
router.put('/change-password', changePassword);

// Subir foto de perfil
router.post('/upload-photo', uploadProfilePhoto);

module.exports = router;