// Script para probar el login de Ana y obtener su perfil
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAnaProfile() {
  console.log('🧪 Probando login y perfil de Ana...\n');

  try {
    // 1. Login con las credenciales de Ana
    console.log('1. Intentando login con Ana...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'ana.gonzalez@cosechando.com',
      password: 'ana123'
    });
    
    console.log('✅ Login exitoso!');
    console.log('Token obtenido:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('Usuario:', loginResponse.data.user);
    console.log();

    const token = loginResponse.data.token;

    // 2. Obtener perfil de Ana
    console.log('2. Obteniendo perfil de Ana...');
    const profileResponse = await axios.get(`${API_BASE}/comerciante/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Perfil obtenido exitosamente!');
    console.log('📋 Datos del perfil de Ana:');
    console.log(JSON.stringify(profileResponse.data, null, 2));
    console.log();

    console.log('🎉 ¡Todo funciona correctamente! Ana puede iniciar sesión y ver su perfil.');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 Verifica que las credenciales de Ana sean correctas:');
      console.log('   Email: ana.gonzalez@cosechando.com');
      console.log('   Password: ana123');
    }
  }
}

// Ejecutar prueba
testAnaProfile();