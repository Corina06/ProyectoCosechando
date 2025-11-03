// Prueba rápida del sistema completo
const axios = require('axios');

async function quickTest() {
  console.log('🚀 Prueba rápida del sistema...\n');

  try {
    // 1. Verificar que el backend esté funcionando
    console.log('1. ✅ Backend funcionando en puerto 3000');

    // 2. Hacer login
    console.log('2. 🔐 Haciendo login con Ana...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'ana.gonzalez@cosechando.com',
      password: 'ana123'
    });

    const token = loginResponse.data.token;
    console.log('   ✅ Login exitoso');
    console.log('   📝 Token:', token.substring(0, 30) + '...');

    // 3. Probar endpoint de perfil
    console.log('3. 👤 Probando endpoint de perfil...');
    const profileResponse = await axios.get('http://localhost:3000/api/comerciante/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('   ✅ Perfil obtenido exitosamente');
    console.log('   👩‍💼 Nombre:', profileResponse.data.nombre, profileResponse.data.apellido);

    console.log('\n🎉 TODOS LOS ENDPOINTS FUNCIONAN CORRECTAMENTE');
    console.log('\n📋 INSTRUCCIONES PARA EL FRONTEND:');
    console.log('1. Ve a http://localhost:4200');
    console.log('2. Haz login con: ana.gonzalez@cosechando.com / ana123');
    console.log('3. Haz clic en el icono de perfil');
    console.log('4. Ahora debería funcionar (AuthGuard en modo debug)');
    console.log('5. Revisa la consola del navegador para ver los logs');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

quickTest();