const User = require('../models/user');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Obtener perfil del comerciante
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Formatear datos para el frontend
    const comerciante = {
      id: user._id,
      nombre: user.name,
      apellido: user.apellido || '',
      email: user.email,
      direccion: user.direccion || '',
      local: user.local || '',
      puesto: user.puesto || '',
      celular: user.celular || '',
      fechaNacimiento: user.fecha || '',
      banco: user.banco || '',
      tipoCuenta: user.tipo || '',
      numeroCuenta: user.cuenta || '',
      foto: user.foto || '/assets/images/default-avatar.png',
      fechaRegistro: user.createdAt ? user.createdAt.toLocaleDateString('es-ES') : '',
      estado: user.estado || 'Activo',
      verificado: user.verificado || false,
      totalVentas: user.totalVentas || 0,
      productosActivos: user.productosActivos || 0
    };

    res.json(comerciante);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar perfil del comerciante
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      nombre,
      apellido,
      email,
      direccion,
      local,
      puesto,
      celular,
      banco,
      tipoCuenta,
      numeroCuenta
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !email) {
      return res.status(400).json({ message: 'Los campos nombre, apellido y email son obligatorios' });
    }

    // Verificar si el email ya existe (si es diferente al actual)
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está en uso por otro usuario' });
    }

    // Actualizar usuario (convertir tipos de datos)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: nombre,
        apellido,
        email,
        direccion,
        local,
        puesto,
        celular: celular ? parseInt(celular.toString().replace(/\D/g, '')) : undefined, // Convertir a número
        banco,
        tipo: tipoCuenta,
        cuenta: numeroCuenta ? parseInt(numeroCuenta.toString().replace(/\D/g, '')) : undefined // Convertir a número
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Formatear datos para el frontend
    const comerciante = {
      id: updatedUser._id,
      nombre: updatedUser.name,
      apellido: updatedUser.apellido || '',
      email: updatedUser.email,
      direccion: updatedUser.direccion || '',
      local: updatedUser.local || '',
      puesto: updatedUser.puesto || '',
      celular: updatedUser.celular || '',
      fechaNacimiento: updatedUser.fecha || '',
      banco: updatedUser.banco || '',
      tipoCuenta: updatedUser.tipo || '',
      numeroCuenta: updatedUser.cuenta || '',
      foto: updatedUser.foto || '/assets/images/default-avatar.png',
      fechaRegistro: updatedUser.createdAt ? updatedUser.createdAt.toLocaleDateString('es-ES') : '',
      estado: updatedUser.estado || 'Activo',
      verificado: updatedUser.verificado || false,
      totalVentas: updatedUser.totalVentas || 0,
      productosActivos: updatedUser.productosActivos || 0
    };

    res.json(comerciante);
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validar campos requeridos
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'La contraseña actual y nueva son obligatorias' });
    }

    // Validar longitud de nueva contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Obtener usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    // Encriptar nueva contraseña
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Subir foto de perfil
const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    // Construir URL de la foto
    const photoUrl = `/uploads/profiles/${req.file.filename}`;

    // Actualizar usuario con la nueva foto
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { foto: photoUrl },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ 
      message: 'Foto de perfil actualizada exitosamente',
      photoUrl: photoUrl
    });
  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePhoto: [upload.single('photo'), uploadProfilePhoto]
};