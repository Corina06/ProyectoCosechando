// Script para probar la actualización del perfil
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testUpdateProfile() {
  console.log('🧪 Probando actualización de perfil...\n');

  try {
    // 1. Login para obtener token
    console.log('1. 🔐 Haciendo login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'ana.gonzalez@cosechando.com',
      password: 'ana123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso');

    // 2. Obtener perfil actual
    console.log('\n2. 📋 Obteniendo perfil actual...');
    const profileResponse = await axios.get(`${API_BASE}/comerciante/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Perfil obtenido:');
    console.log('   Nombre:', profileResponse.data.nombre, profileResponse.data.apellido);
    console.log('   Email:', profileResponse.data.email);
    console.log('   Celular:', profileResponse.data.celular);

    // 3. Actualizar perfil
    console.log('\n3. 🔄 Actualizando perfil...');
    const updateData = {
      nombre: 'Ana María',
      apellido: 'González Rodríguez',
      email: 'ana.gonzalez@cosechando.com',
      direccion: 'Calle 50, Bella Vista, Ciudad de Panamá - ACTUALIZADA',
      local: 'Local de Ana - ACTUALIZADO',
      puesto: 'Mercado Central, Puesto #15 - ACTUALIZADO',
      celular: '6523-2563', // String que se convertirá a Number
      banco: 'Banco Nacional de Panamá',
      tipoCuenta: 'Ahorro',
      numeroCuenta: '04-01-01-123456789' // String que se convertirá a Number
    };

    const updateResponse = await axios.put(`${API_BASE}/comerciante/profile`, updateData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Perfil actualizado exitosamente:');
    console.log('   Dirección:', updateResponse.data.direccion);
    console.log('   Local:', updateResponse.data.local);
    console.log('   Puesto:', updateResponse.data.puesto);

    console.log('\n🎉 ¡Actualización de perfil funciona correctamente!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
  }
}

testUpdateProfile();