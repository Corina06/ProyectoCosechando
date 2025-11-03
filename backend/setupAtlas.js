const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 CONFIGURACIÓN DE MONGODB ATLAS');
console.log('================================');
console.log('');
console.log('📋 Antes de continuar, asegúrate de haber:');
console.log('1. ✅ Creado una cuenta en MongoDB Atlas');
console.log('2. ✅ Creado un cluster gratuito (M0)');
console.log('3. ✅ Creado un usuario de base de datos');
console.log('4. ✅ Configurado acceso de red (0.0.0.0/0)');
console.log('5. ✅ Obtenido la cadena de conexión');
console.log('');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupAtlas() {
  try {
    console.log('🔗 CONFIGURACIÓN DE CONEXIÓN');
    console.log('');
    
    const mongoUri = await askQuestion('📝 Pega tu cadena de conexión de MongoDB Atlas: ');
    
    if (!mongoUri || !mongoUri.includes('mongodb+srv://')) {
      console.log('❌ Error: La cadena de conexión no parece válida');
      console.log('💡 Debe empezar con: mongodb+srv://');
      process.exit(1);
    }
    
    console.log('');
    console.log('✅ Cadena de conexión válida recibida');
    
    // Actualizar archivo .env
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Reemplazar la URI de MongoDB
    envContent = envContent.replace(
      /MONGO_URI=.*/,
      `MONGO_URI=${mongoUri}`
    );
    
    // Cambiar a producción
    envContent = envContent.replace(
      /NODE_ENV=development/,
      'NODE_ENV=production'
    );
    
    // Escribir archivo actualizado
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Archivo .env actualizado');
    
    // Crear archivo de respaldo con configuración local
    const envLocalContent = envContent.replace(
      `MONGO_URI=${mongoUri}`,
      'MONGO_URI=mongodb://localhost:27017/cosechando'
    ).replace(
      'NODE_ENV=production',
      'NODE_ENV=development'
    );
    
    fs.writeFileSync(path.join(__dirname, '.env.local'), envLocalContent);
    console.log('✅ Archivo .env.local creado (para desarrollo local)');
    
    console.log('');
    console.log('🎉 ¡CONFIGURACIÓN COMPLETADA!');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Ejecutar: node testConnection.js (para probar la conexión)');
    console.log('2. Ejecutar: node migrateToCloud.js (para migrar datos)');
    console.log('3. Ejecutar: npm start (para probar con Atlas)');
    console.log('');
    console.log('💡 Para volver a desarrollo local:');
    console.log('   cp .env.local .env');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

setupAtlas();