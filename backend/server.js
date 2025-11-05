// Cargar variables de entorno desde archivo .env solo en desarrollo
// En producción (Render), las variables vienen del sistema (process.env)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user'); 
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const app = express();

// Middleware CORS (DEBE IR PRIMERO, antes de las rutas)
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:4201',
  process.env.FRONTEND_URL // URL del frontend en producción
].filter(Boolean); // Elimina valores undefined/null

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    // En desarrollo, permitir cualquier origen local
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // En producción, verificar contra la lista de orígenes permitidos
    if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '').replace('http://', '')))) {
      callback(null, true);
    } else {
      callback(null, true); // Temporalmente permitir todos para facilitar el despliegue
    }
  },
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

// Servir el frontend compilado (solo en producción)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const frontendPath = path.join(__dirname, '../frontend/dist/cosechando/browser');
  app.use(express.static(frontendPath));
}

// Conectar a MongoDB con opciones mejoradas
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando';

// Logging detallado para debugging en Render
console.log('🔍 CONFIGURACIÓN DE MONGODB:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'no definido'}`);
console.log(`   MONGO_URI existe: ${!!process.env.MONGO_URI}`);
console.log(`   MONGO_URI (primeros 50 chars): ${process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 50) + '...' : 'NO DEFINIDA'}`);
console.log(`   URI usada: ${mongoUri.includes('localhost') ? 'LOCAL' : 'ATLAS (NUBE)'}`);
console.log(`   Conectando a: ${mongoUri.includes('localhost') ? 'Base de datos LOCAL' : 'Base de datos EN LA NUBE'}`);

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000, // Aumentado a 10 segundos para Render
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true
})
  .then(() => {
    console.log('✅ Conectado exitosamente a MongoDB');
    console.log(`📍 Tipo: ${mongoUri.includes('localhost') ? 'LOCAL (desarrollo)' : 'NUBE (producción)'}`);
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    console.error('❌ Error completo:', err);
    console.log('💡 Verifica que MongoDB esté ejecutándose localmente o que la URL de Atlas sea correcta');
    console.log('💡 Verifica MONGO_URI en Render Dashboard → Environment');
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

// Health check endpoint (antes del catch-all del frontend)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    server: 'running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Ruta para la raíz - API info
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is running',
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Servir el frontend Angular (debe ir al final, después de todas las rutas de API)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const frontendPath = path.join(__dirname, '../frontend/dist/cosechando/browser');
  
  // Todas las rutas que no sean /api/* o /health van al frontend
  app.get('*', (req, res) => {
    // Si es una ruta de API o health, ya fue manejada arriba
    if (req.path.startsWith('/api') || req.path === '/health') {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    
    // Para cualquier otra ruta, servir index.html del frontend
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // En desarrollo, solo mostrar mensaje
  app.get('/', (req, res) => {
    res.send('API is running (Development Mode)');
  });
}

// Inicia el servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});