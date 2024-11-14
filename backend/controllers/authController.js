const User = require('../models/user');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    // Verificar contraseña
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    // Crear y firmar el token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

module.exports = { loginUser };
