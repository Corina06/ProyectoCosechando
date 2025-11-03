// Script simple para probar la actualización del perfil
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testSimpleUpdate() {
  console.log('🧪 Prueba simple de actualización...\n');

  try {
    // 1. Login
    console.log('1. Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'ana.gonzalez@cosechando.com',
      password: 'ana123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido');

    // 2. Actualizar solo el nombre
    console.log('2. Actualizando solo el nombre...');
    const updateData = {
      nombre: 'Ana María ACTUALIZADA',
      apellido: 'González Rodríguez',
      email: 'ana.gonzalez@cosechando.com',
      direccion: 'Calle 50, Bella Vista, Ciudad de Panamá',
      local: 'Local de Ana',
      puesto: 'Mercado Central, Puesto #15',
      celular: '6523-2563',
      banco: 'Banco Nacional de Panamá',
      tipoCuenta: 'Ahorro',
      numeroCuenta: '04-01-01-123456789'
    };

    const updateResponse = await axios.put(`${API_BASE}/comerciante/profile`, updateData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Actualización exitosa');
    console.log('Nombre actualizado:', updateResponse.data.nombre);

    console.log('\n🎉 ¡Prueba exitosa!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testSimpleUpdate();