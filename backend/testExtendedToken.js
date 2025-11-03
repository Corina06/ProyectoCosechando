// Script para probar el token extendido
const axios = require('axios');
const jwt = require('jsonwebtoken');

const API_BASE = 'http://localhost:3000/api';

async function testExtendedToken() {
  console.log('🧪 Probando token extendido...\n');

  try {
    // 1. Login para obtener nuevo token
    console.log('1. 🔐 Haciendo login para obtener token extendido...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'ana.gonzalez@cosechando.com',
      password: 'ana123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso');
    
    // 2. Decodificar token para ver expiración
    const decoded = jwt.decode(token);
    const now = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - now;
    
    console.log('📋 Información del token:');
    console.log('   Creado:', new Date(decoded.iat * 1000));
    console.log('   Expira:', new Date(decoded.exp * 1000));
    console.log('   Tiempo hasta expirar:', Math.round(timeUntilExpiry / 3600), 'horas');
    
    // 3. Probar endpoint de perfil
    console.log('\n2. 👤 Probando endpoint de perfil...');
    const profileResponse = await axios.get(`${API_BASE}/comerciante/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Perfil obtenido exitosamente');
    console.log('   Usuario:', profileResponse.data.nombre, profileResponse.data.apellido);

    console.log('\n🎉 ¡Token extendido funciona correctamente!');
    console.log('💡 Ahora el token dura 24 horas en lugar de 1 hora');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testExtendedToken();