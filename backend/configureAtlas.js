const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 CONFIGURACIÓN DE CONTRASEÑA MONGODB ATLAS');
console.log('===========================================');
console.log('');
console.log('📋 Tu cadena de conexión actual tiene: <db_password>');
console.log('🔑 Necesitamos reemplazarla con tu contraseña real');
console.log('');

rl.question('🔐 Ingresa la contraseña de tu usuario db_user: ', (password) => {
  if (!password || password.trim() === '') {
    console.log('❌ Error: La contraseña no puede estar vacía');
    rl.close();
    return;
  }

  try {
    // Leer archivo .env
    let envContent = fs.readFileSync('.env', 'utf8');
    
    // Reemplazar <db_password> con la contraseña real
    const updatedContent = envContent.replace(/<db_password>/g, password);
    
    // Escribir archivo actualizado
    fs.writeFileSync('.env', updatedContent);
    
    // Crear respaldo con configuración local
    const localContent = updatedContent
      .replace(/MONGO_URI=mongodb\+srv:\/\/.*/, 'MONGO_URI=mongodb://localhost:27017/cosechando')
      .replace(/NODE_ENV=production/, 'NODE_ENV=development');
    
    fs.writeFileSync('.env.local', localContent);
    
    console.log('');
    console.log('✅ ¡Configuración completada!');
    console.log('✅ Archivo .env actualizado con MongoDB Atlas');
    console.log('✅ Archivo .env.local creado para desarrollo local');
    console.log('');
    console.log('🧪 PRÓXIMO PASO: Probar la conexión');
    console.log('   Ejecuta: npm run test-connection');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  rl.close();
});

rl.on('close', () => {
  process.exit(0);
});