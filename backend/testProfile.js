// Script de prueba para verificar las rutas del perfil
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testProfileEndpoints() {
  console.log('🧪 Iniciando pruebas de endpoints del perfil...\n');

  try {
    // 1. Probar login para obtener token
    console.log('1. Probando login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido\n');

    // 2. Probar obtener perfil
    console.log('2. Probando obtener perfil...');
    const profileResponse = await axios.get(`${API_BASE}/comerciante/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Perfil obtenido exitosamente:');
    console.log(JSON.stringify(profileResponse.data, null, 2));
    console.log();

    // 3. Probar actualizar perfil
    console.log('3. Probando actualizar perfil...');
    const updateResponse = await axios.put(`${API_BASE}/comerciante/profile`, {
      nombre: 'Nombre Actualizado',
      apellido: 'Apellido Actualizado',
      email: profileResponse.data.email,
      direccion: 'Nueva dirección',
      local: 'Nuevo local',
      puesto: 'Nuevo puesto',
      celular: '1234567890',
      banco: 'Nuevo banco',
      tipoCuenta: 'Corriente',
      numeroCuenta: '9876543210'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Perfil actualizado exitosamente');
    console.log();

    console.log('🎉 Todas las pruebas pasaron exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Sugerencia: Asegúrate de que el servidor esté ejecutándose y que exista un usuario de prueba.');
    }
  }
}

// Ejecutar pruebas solo si se llama directamente
if (require.main === module) {
  testProfileEndpoints();
}

module.exports = { testProfileEndpoints };