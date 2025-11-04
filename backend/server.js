require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const corsConfig = require('./cors-config');
const User = require('./models/user'); 
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const app = express();

// Middleware CORS personalizado (DEBE IR PRIMERO)
app.use(corsConfig);

// Middleware para parsear JSON con límite aumentado para imágenes Base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos (fotos de perfil)
app.use('/uploads', express.static('uploads'));

// Conectar a MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando';
console.log(`Conectando a MongoDB: ${mongoUri.includes('localhost') ? 'Base de datos LOCAL' : 'Base de datos EN LA NUBE'}`);

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Conectado exitosamente a MongoDB');
    console.log(`📍 Tipo: ${mongoUri.includes('localhost') ? 'LOCAL (desarrollo)' : 'NUBE (producción)'}`);
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    console.log('💡 Verifica que MongoDB esté ejecutándose localmente o que la URL de Atlas sea correcta');
  });

// Rutas
const productRoutes = require('./routes/product');
const dashboardRoutes = require('./routes/dashboard');
const comercianteRoutes = require('./routes/comerciante');
const expenseRoutes = require('./routes/expense');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/comerciante', comercianteRoutes);
app.use('/api/expenses', expenseRoutes);

// Rutas de administración (solo desarrollo)
if (process.env.NODE_ENV === 'development') {
  const adminRoutes = require('./routes/admin');
  app.use('/api/admin', adminRoutes);
}

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('API is running');
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});