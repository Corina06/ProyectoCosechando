const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 SOLUCIÓN DE PROBLEMAS DE AUTENTICACIÓN');
console.log('========================================');
console.log('');
console.log('❌ Error: authentication failed');
console.log('');
console.log('🔍 POSIBLES CAUSAS:');
console.log('1. El usuario db_user no existe en MongoDB Atlas');
console.log('2. La contraseña db_user12345 es incorrecta');
console.log('3. El usuario no tiene permisos suficientes');
console.log('');
console.log('💡 SOLUCIONES:');
console.log('');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function fixAuth() {
  try {
    console.log('📋 OPCIÓN 1: Usar credenciales existentes');
    const useExisting = await askQuestion('¿Ya tienes un usuario creado en MongoDB Atlas? (s/n): ');
    
    if (useExisting.toLowerCase() === 's') {
      const username = await askQuestion('👤 Ingresa el nombre de usuario: ');
      const password = await askQuestion('🔐 Ingresa la contraseña: ');
      
      // Actualizar .env
      let envContent = fs.readFileSync('.env', 'utf8');
      
      // Construir nueva URI
      const newUri = `mongodb+srv://${username}:${password}@cosechando.kj2sgrt.mongodb.net/cosechando?retryWrites=true&w=majority&appName=Cosechando`;
      
      envContent = envContent.replace(/MONGO_URI=mongodb\+srv:\/\/.*/, `MONGO_URI=${newUri}`);
      envContent = envContent.replace(/MONGO_URI_PRODUCTION=mongodb\+srv:\/\/.*/, `MONGO_URI_PRODUCTION=${newUri}`);
      
      fs.writeFileSync('.env', envContent);
      
      console.log('');
      console.log('✅ Credenciales actualizadas');
      console.log('🧪 Probando conexión...');
      
      // Probar conexión
      const { execSync } = require('child_process');
      execSync('npm run test-connection', { stdio: 'inherit' });
      
    } else {
      console.log('');
      console.log('📋 INSTRUCCIONES PARA CREAR USUARIO:');
      console.log('');
      console.log('1. Ve a MongoDB Atlas Dashboard');
      console.log('2. Database Access → Database Users');
      console.log('3. Add New Database User');
      console.log('4. Authentication Method: Password');
      console.log('5. Username: cosechando_user');
      console.log('6. Password: (genera una segura)');
      console.log('7. Database User Privileges: Read and write to any database');
      console.log('8. Add User');
      console.log('');
      console.log('Después ejecuta este script nuevamente con las nuevas credenciales');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

fixAuth();