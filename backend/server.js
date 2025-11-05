// Cargar variables de entorno desde archivo .env solo en desarrollo
// En producción (Render), las variables vienen del sistema (process.env)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
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

// Configurar ruta del frontend compilado (solo en producción)
let frontendPath = null;
if (process.env.NODE_ENV === 'production') {
  // Intentar múltiples rutas posibles según la versión de Angular
  const possiblePaths = [
    path.join(__dirname, '../frontend/dist/cosechando/browser'), // Angular 17+ con application builder
    path.join(__dirname, '../frontend/dist/cosechando'),         // Angular tradicional
    path.join(__dirname, '../../frontend/dist/cosechando/browser'), // Alternativa
    path.join(__dirname, '../../frontend/dist/cosechando')       // Alternativa
  ];
  
  // Buscar la primera ruta que exista
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      frontendPath = possiblePath;
      console.log(`📁 Frontend encontrado en: ${frontendPath}`);
      break;
    }
  }
  
  // Si no se encontró, usar la ruta por defecto
  if (!frontendPath) {
    frontendPath = path.join(__dirname, '../frontend/dist/cosechando/browser');
    console.log(`📁 Frontend path configurado: ${frontendPath}`);
    console.error(`\n⚠️⚠️⚠️ ERROR CRÍTICO: Frontend no encontrado ⚠️⚠️⚠️`);
    console.error(`   Rutas verificadas:`);
    possiblePaths.forEach(p => console.error(`   - ${p}`));
    console.error('\n   CAUSA: El frontend no fue compilado durante el build');
    console.error('\n   SOLUCIÓN:');
    console.error('   1. Ve a Render Dashboard → Tu servicio');
    console.error('   2. Click en "Settings"');
    console.error('   3. Cambia el Build Command a uno de estos:');
    console.error('      Opción A: bash build.sh');
    console.error('      Opción B: npm run build');
    console.error('      Opción C: cd backend && npm install && cd ../frontend && npm install && npm run build:prod');
    console.error('   4. Guarda los cambios');
    console.error('   5. Render reiniciará automáticamente\n');
  } else {
    console.log('✅ Frontend compilado encontrado\n');
  }
}

// Conectar a MongoDB con opciones mejoradas
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando';

// Logging detallado para debugging en Render
console.log('\n🔍 CONFIGURACIÓN DE MONGODB:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'no definido'}`);
console.log(`   MONGO_URI existe: ${!!process.env.MONGO_URI}`);
console.log(`   MONGO_URI (primeros 50 chars): ${process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 50) + '...' : 'NO DEFINIDA'}`);
console.log(`   URI usada: ${mongoUri.includes('localhost') ? 'LOCAL' : 'ATLAS (NUBE)'}`);
console.log(`   Conectando a: ${mongoUri.includes('localhost') ? 'Base de datos LOCAL' : 'Base de datos EN LA NUBE'}\n`);

// ⚠️ ADVERTENCIA CRÍTICA si MONGO_URI no está configurada en producción
if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
  console.error('\n⚠️⚠️⚠️ ERROR CRÍTICO: MONGO_URI NO ESTÁ CONFIGURADA ⚠️⚠️⚠️');
  console.error('   El backend está intentando conectarse a MongoDB LOCAL (localhost:27017)');
  console.error('   pero está en PRODUCCIÓN. Debes configurar MONGO_URI en Render.');
  console.error('\n   PASOS PARA CORREGIR:');
  console.error('   1. Ve a Render Dashboard → Tu servicio');
  console.error('   2. Click en "Environment"');
  console.error('   3. Agrega la variable:');
  console.error('      Key: MONGO_URI');
  console.error('      Value: mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/cosechando?retryWrites=true&w=majority');
  console.error('   4. Guarda los cambios');
  console.error('   5. Render reiniciará automáticamente\n');
}

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
    console.error('\n❌❌❌ ERROR CONECTANDO A MONGODB ❌❌❌');
    console.error('   Mensaje:', err.message);
    console.error('\n   CAUSA PROBABLE:');
    if (mongoUri.includes('localhost')) {
      console.error('   ⚠️ MONGO_URI no está configurada en Render');
      console.error('   ⚠️ Está usando MongoDB LOCAL (localhost:27017)');
      console.error('   ⚠️ En producción necesitas MongoDB Atlas');
    } else {
      console.error('   ⚠️ La URL de MongoDB Atlas puede ser incorrecta');
      console.error('   ⚠️ Verifica que MONGO_URI sea correcta');
    }
    console.error('\n   SOLUCIÓN:');
    console.error('   1. Ve a Render Dashboard → Tu servicio');
    console.error('   2. Click en "Environment"');
    console.error('   3. Agrega/verifica la variable MONGO_URI:');
    console.error('      Formato: mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/cosechando?retryWrites=true&w=majority');
    console.error('   4. Guarda los cambios');
    console.error('   5. Render reiniciará automáticamente\n');
    console.error('⚠️ El servidor continuará ejecutándose, pero las operaciones de base de datos fallarán\n');
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
if (process.env.NODE_ENV === 'production' && frontendPath && fs.existsSync(frontendPath)) {
  // Servir archivos estáticos del frontend (JS, CSS, imágenes, etc.)
  // IMPORTANTE: Debe ir ANTES del catch-all para que los archivos estáticos se sirvan primero
  // Solo archivos físicos (JS, CSS, imágenes) son estáticos, el resto es dinámico
  app.use(express.static(frontendPath, {
    maxAge: '1y', // Cache por 1 año para archivos estáticos
    etag: true,
    // No servir index.html como archivo estático, el catch-all lo manejará
    index: false
  }));
  
  console.log('✅ Archivos estáticos del frontend configurados');
  
  // Catch-all SOLO para GET requests de rutas del frontend Angular
  // IMPORTANTE: Solo captura GET, las rutas API (POST, PUT, DELETE, etc.) ya fueron manejadas arriba
  // Las rutas API dinámicas con GET también fueron manejadas antes de este catch-all
  app.get('*', (req, res) => {
    // Verificar que NO sea una ruta de API (ya fueron manejadas arriba)
    if (req.path.startsWith('/api')) {
      // Esta ruta debería haber sido manejada por las rutas API
      // Si llegamos aquí, es un endpoint no encontrado
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    
    // Verificar que NO sea health check
    if (req.path === '/health') {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    
    // Verificar que NO sea uploads (archivos estáticos del backend)
    if (req.path.startsWith('/uploads')) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Para cualquier otra ruta GET, servir index.html del frontend
    // Angular Router manejará las rutas del lado del cliente (dinámicamente)
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend index.html not found');
    }
  });
  
  console.log('✅ Frontend Angular configurado para servir en producción');
  console.log(`   Rutas API dinámicas: /api/* (GET, POST, PUT, DELETE)`);
  console.log(`   Health check: /health`);
  console.log(`   Archivos estáticos: JS, CSS, imágenes del frontend`);
  console.log(`   Frontend SPA: todas las demás rutas GET → Angular Router`);
} else if (process.env.NODE_ENV === 'production') {
  // Frontend no compilado - mostrar mensaje útil
  console.warn('⚠️ Frontend no compilado - solo API disponible');
  
  // Manejar todas las rutas que no sean API
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    
    res.status(503).send(`
      <html>
        <head><title>Frontend no disponible</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
          <h1>⚠️ Frontend no compilado</h1>
          <p>El frontend necesita ser compilado durante el build.</p>
          <p>Por favor, configura el Build Command en Render para compilar el frontend.</p>
          <pre style="background: #f5f5f5; padding: 20px; border-radius: 5px; text-align: left; display: inline-block;">
Build Command: npm run build
o
Build Command: bash build.sh
          </pre>
          <p style="margin-top: 20px;">
            <strong>API disponible en:</strong><br>
            <a href="/api">/api</a> | <a href="/health">/health</a>
          </p>
        </body>
      </html>
    `);
  });
} else {
  // En desarrollo, solo mostrar mensaje
  app.get('/', (req, res) => {
    res.send('API is running (Development Mode)');
  });
}

// Inicia el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
})
.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌❌❌ ERROR: Puerto ${PORT} ya está en uso ❌❌❌`);
    console.error('\n   SOLUCIÓN:');
    console.error('   Opción 1: Cerrar el proceso que está usando el puerto');
    console.error('   Opción 2: Usar otro puerto configurando PORT en variables de entorno');
    console.error('\n   En Windows PowerShell:');
    console.error(`   netstat -ano | findstr :${PORT}`);
    console.error('   taskkill /PID <PID> /F');
    console.error('\n   O simplemente cierra la otra instancia del servidor\n');
    process.exit(1);
  } else {
    console.error(`\n❌ Error iniciando servidor: ${err.message}\n`);
    process.exit(1);
  }
});