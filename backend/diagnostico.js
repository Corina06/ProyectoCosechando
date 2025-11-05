require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/product');

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     DIAGNÓSTICO COMPLETO DEL BACKEND                    ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

const app = express();

// Middleware CORS
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Middleware JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ========== DIAGNÓSTICO DE CONEXIÓN A MONGODB ==========
console.log('🔍 PASO 1: Verificando conexión a MongoDB...\n');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando';
console.log(`📍 URI de MongoDB: ${mongoUri.includes('localhost') ? 'LOCAL' : 'ATLAS (NUBE)'}`);
console.log(`   ${mongoUri.substring(0, 50)}...\n`);

let dbConnected = false;

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true
})
  .then(async () => {
    dbConnected = true;
    console.log('✅ CONEXIÓN A MONGODB: EXITOSA\n');
    console.log(`   📊 Base de datos: ${mongoose.connection.name}`);
    console.log(`   🌐 Host: ${mongoose.connection.host}`);
    console.log(`   📡 Estado: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}\n`);
    
    // Verificar productos
    console.log('🔍 PASO 2: Verificando productos en la base de datos...\n');
    const products = await Product.find();
    console.log(`✅ Productos encontrados: ${products.length}\n`);
    
    if (products.length > 0) {
      console.log('📦 LISTA DE PRODUCTOS:');
      console.log('─'.repeat(60));
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   ID: ${product.id} | Categoría: ${product.category}`);
        console.log(`   Precio: $${product.price} | Stock: ${product.stock ? 'Disponible' : 'Agotado'}`);
        console.log(`   Cantidad: ${product.quantity} ${product.unit || 'unidad'}`);
      });
      console.log('\n' + '─'.repeat(60));
    } else {
      console.log('⚠️ No hay productos en la base de datos');
      console.log('💡 Ejecuta: node seedProducts.js para agregar productos de ejemplo\n');
    }
    
    // Verificar colecciones
    console.log('\n🔍 PASO 3: Verificando colecciones...\n');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Colecciones encontradas: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
  })
  .catch(err => {
    dbConnected = false;
    console.log('❌ CONEXIÓN A MONGODB: FALLIDA\n');
    console.log(`   Error: ${err.message}\n`);
    console.log('💡 SOLUCIONES:');
    console.log('   1. Si usas MongoDB local: Verifica que MongoDB esté corriendo');
    console.log('   2. Si usas MongoDB Atlas: Verifica la URL en .env');
    console.log('   3. Verifica que las credenciales sean correctas\n');
    console.log('⚠️ El servidor continuará, pero las operaciones de BD fallarán\n');
  });

// ========== RUTAS DE DIAGNÓSTICO ==========
app.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    server: 'running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/products', async (req, res) => {
  try {
    console.log(`\n📥 PETICIÓN RECIBIDA: GET /api/products`);
    console.log(`   Origin: ${req.headers.origin || 'No especificado'}`);
    console.log(`   Timestamp: ${new Date().toISOString()}\n`);
    
    const products = await Product.find();
    console.log(`✅ Respuesta: ${products.length} productos enviados\n`);
    
    res.json(products);
  } catch (err) {
    console.error(`❌ Error en /api/products: ${err.message}\n`);
    res.status(500).json({ message: err.message });
  }
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(60));
  console.log(`🚀 SERVIDOR INICIADO EN PUERTO ${PORT}`);
  console.log('═'.repeat(60));
  console.log(`\n📡 Endpoints disponibles:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/api/products`);
  console.log(`\n💡 El servidor está listo para recibir peticiones`);
  console.log(`💡 Presiona Ctrl+C para detener el servidor\n`);
});

// Manejo de errores del servidor
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
});






