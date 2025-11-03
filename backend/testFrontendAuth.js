// Script para probar la autenticación del frontend
const axios = require('axios');

const API_BASE = 'http://localhost:4200'; // Frontend
const API_BACKEND = 'http://localhost:3000/api'; // Backend

async function testFrontendAuth() {
  console.log('🧪 Probando autenticación del frontend...\n');

  try {
    // 1. Probar que el frontend esté funcionando
    console.log('1. Verificando que el frontend esté activo...');
    try {
      await axios.get(API_BASE, { timeout: 5000 });
      console.log('✅ Frontend está activo en http://localhost:4200');
    } catch (error) {
      console.log('❌ Frontend no está activo. Asegúrate de ejecutar "ng serve"');
      return;
    }

    // 2. Probar login directo al backend
    console.log('\n2. Probando login directo al backend...');
    const loginResponse = await axios.post(`${API_BACKEND}/auth/login`, {
      email: 'ana.gonzalez@cosechando.com',
      password: 'ana123'
    });
    
    console.log('✅ Login al backend exitoso');
    console.log('Token recibido:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('Usuario:', loginResponse.data.user);

    const token = loginResponse.data.token;

    // 3. Probar endpoint de perfil con el token
    console.log('\n3. Probando endpoint de perfil...');
    const profileResponse = await axios.get(`${API_BACKEND}/comerciante/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Perfil obtenido exitosamente');
    console.log('Nombre:', profileResponse.data.nombre, profileResponse.data.apellido);
    console.log('Email:', profileResponse.data.email);
    console.log('Local:', profileResponse.data.local);

    console.log('\n🎉 Todos los endpoints del backend funcionan correctamente!');
    console.log('\n💡 Si el perfil en el frontend no funciona, el problema está en:');
    console.log('   - El token no se está guardando en localStorage');
    console.log('   - El interceptor HTTP no está enviando el token');
    console.log('   - Hay un problema de CORS');
    console.log('\n🔍 Revisa la consola del navegador para más detalles.');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testFrontendAuth();