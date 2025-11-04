const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

// Obtener todos los usuarios (solo para desarrollo)
router.get('/users', async (req, res) => {
  try {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'No disponible en producción' });
    }
    
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    const userStats = {
      total: users.length,
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        name: `${user.name} ${user.apellido}`,
        local: user.local,
        celular: user.celular,
        registeredAt: user.createdAt || 'No disponible'
      }))
    };
    
    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

// Eliminar usuario por email (solo para desarrollo)
router.delete('/users/:email', async (req, res) => {
  try {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'No disponible en producción' });
    }
    
    const { email } = req.params;
    console.log('🗑️ Eliminando usuario con email:', email);
    
    const deletedUser = await User.findOneAndDelete({ email });
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    console.log('✅ Usuario eliminado exitosamente:', email);
    res.json({ 
      message: 'Usuario eliminado exitosamente',
      deletedUser: {
        email: deletedUser.email,
        name: `${deletedUser.name} ${deletedUser.apellido}`
      }
    });
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router;