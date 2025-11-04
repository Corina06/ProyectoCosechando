const User = require('../models/user');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    console.log('📝 Intento de registro recibido:', req.body);
    const { name, apellido, email, direccion, local, puesto, celular, fecha, banco, tipo, cuenta, password } = req.body;

    // Validar datos requeridos
    if (!name || !apellido || !email || !password) {
      console.log('❌ Datos faltantes en el registro');
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Verificar si el usuario ya existe
    console.log('🔍 Verificando si el usuario existe:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Usuario ya existe:', email);
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const user = new User({
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
      password
    });

    console.log('💾 Guardando usuario en la base de datos...');
    await user.save();
    console.log('✅ Usuario guardado exitosamente:', user._id);

    // Crear token (extendido a 24 horas)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log('🔑 Token JWT creado para usuario:', user._id);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        apellido: user.apellido,
        email: user.email,
        celular: user.celular,
        direccion: user.direccion,
        local: user.local,
        puesto: user.puesto,
        fecha: user.fecha,
        banco: user.banco,
        tipo: user.tipo,
        cuenta: user.cuenta
      }
    });
    console.log('✅ Respuesta de registro enviada exitosamente');
  } catch (error) {
    console.error('❌ Error en registerUser:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Intento de login recibido:', { email, password: '***' });

  try {
    // Buscar al usuario por email
    console.log('🔍 Buscando usuario por email:', email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    console.log('✅ Usuario encontrado:', user.email);
    console.log('🔑 Verificando contraseña...');

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    console.log('🔑 Resultado de verificación de contraseña:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Contraseña incorrecta para usuario:', email);
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    // Crear y firmar el token JWT
    console.log('🔑 Creando token JWT...');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    console.log('✅ Login exitoso para usuario:', user.email);
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        apellido: user.apellido,
        email: user.email,
        celular: user.celular,
        direccion: user.direccion,
        local: user.local,
        puesto: user.puesto,
        fecha: user.fecha,
        banco: user.banco,
        tipo: user.tipo,
        cuenta: user.cuenta
      }
    });
  } catch (error) {
    console.error('❌ Error en loginUser:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

module.exports = { loginUser, registerUser };
