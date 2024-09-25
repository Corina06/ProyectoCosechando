// models/user.js
const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  direccion: { type: String, required: true },
  local: { type: String, required: true },
  puesto: { type: String, required: true },
  celular: { type: Number, required: true },
  fecha: { type: Date, required: true },
  banco: { type: String, required: true },
  tipo: { type: String, required: true },
  cuenta: { type: Number, required: true },
  password: { type: String, required: true }
});

// // Middleware para encriptar la contraseña antes de guardar
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Método para comparar contraseñas
// userSchema.methods.comparePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
