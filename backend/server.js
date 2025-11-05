require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user'); 
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const app = express();

// Middleware CORS (DEBE IR PRIMERO, antes de las rutas)
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Middleware para parsear JSON (DEBE IR ANTES de las rutas)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos (fotos de perfil)
app.use('/uploads', express.static('uploads'));

// Conectar a MongoDB con opciones mejoradas
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando';
console.log(`Conectando a MongoDB: ${mongoUri.includes('localhost') ? 'Base de datos LOCAL' : 'Base de datos EN LA NUBE'}`);

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true
})
  .then(() => {
    console.log('✅ Conectado exitosamente a MongoDB');
    console.log(`📍 Tipo: ${mongoUri.includes('localhost') ? 'LOCAL (desarrollo)' : 'NUBE (producción)'}`);
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    console.log('💡 Verifica que MongoDB esté ejecutándose localmente o que la URL de Atlas sea correcta');
    console.log('⚠️ El servidor continuará ejecutándose, pero las operaciones de base de datos fallarán');
    // NO salir del proceso - permitir que el servidor inicie
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

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    server: 'running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});