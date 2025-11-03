const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 PREPARACIÓN COMPLETA PARA DESPLIEGUE');
console.log('======================================');
console.log('');

const steps = [
  {
    name: 'Verificar configuración de Atlas',
    action: () => {
      const envContent = fs.readFileSync('.env', 'utf8');
      if (!envContent.includes('mongodb+srv://')) {
        throw new Error('MongoDB Atlas no configurado. Ejecuta: node setupAtlas.js');
      }
      console.log('✅ MongoDB Atlas configurado');
    }
  },
  {
    name: 'Probar conexión a Atlas',
    action: () => {
      execSync('node testConnection.js', { stdio: 'inherit' });
    }
  },
  {
    name: 'Poblar base de datos con productos',
    action: () => {
      console.log('📦 Creando productos de ejemplo...');
      execSync('node seedProducts.js', { stdio: 'inherit' });
    }
  },
  {
    name: 'Crear órdenes de ejemplo',
    action: () => {
      console.log('📋 Creando órdenes de ejemplo...');
      execSync('node seedOrders.js', { stdio: 'inherit' });
    }
  },
  {
    name: 'Verificar datos en Atlas',
    action: () => {
      console.log('🔍 Verificando datos...');
      execSync('node checkData.js', { stdio: 'inherit' });
    }
  }
];

async function runPreparation() {
  try {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.log(`\n📋 Paso ${i + 1}/${steps.length}: ${step.name}`);
      console.log('─'.repeat(50));
      
      await step.action();
      
      console.log(`✅ Completado: ${step.name}`);
    }
    
    console.log('\n🎉 ¡PREPARACIÓN COMPLETADA!');
    console.log('');
    console.log('📊 TU PROYECTO ESTÁ LISTO PARA DESPLIEGUE');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. 🌐 Desplegar backend en Railway/Render');
    console.log('2. 🎨 Desplegar frontend en Netlify/Vercel');
    console.log('3. 🔗 Actualizar URLs en environment.prod.ts');
    console.log('');
    console.log('📖 Consulta DEPLOYMENT_GUIDE.md para instrucciones detalladas');
    
  } catch (error) {
    console.error(`\n❌ Error en: ${error.message}`);
    console.log('\n🔧 Revisa los errores anteriores y vuelve a intentar');
    process.exit(1);
  }
}

runPreparation();