// Clona colecciones desde la base 'test' hacia 'cosechando' en el MISMO cluster
// Uso: node scripts/database/clone-test-to-cosechando.js
// Requisitos: process.env.MONGO_URI debe apuntar al cluster (URI SRV válida)

require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI no está definida. Configúrala en el entorno.');
    process.exit(1);
  }

  // Conexión única al cluster; luego operamos sobre DBs específicas
  console.log('🔌 Conectando al cluster MongoDB...');
  const conn = await mongoose.createConnection(uri).asPromise();
  console.log('✅ Conectado');

  const sourceDbName = 'test';
  const targetDbName = 'cosechando';
  const collections = ['users', 'products', 'orders', 'expenses'];

  const sourceDb = conn.useDb(sourceDbName);
  const targetDb = conn.useDb(targetDbName);

  for (const collName of collections) {
    try {
      const sourceColl = sourceDb.collection(collName);
      const targetColl = targetDb.collection(collName);

      const [srcCount, tgtCountBefore] = await Promise.all([
        sourceColl.countDocuments().catch(() => 0),
        targetColl.countDocuments().catch(() => 0)
      ]);
      console.log(`\n📦 Colección: ${collName}`);
      console.log(`   Origen (${sourceDbName}): ${srcCount} docs`);
      console.log(`   Destino (${targetDbName}) antes: ${tgtCountBefore} docs`);

      // Pipeline: copiar todo y fusionar por _id sin pisar existentes
      const pipeline = [
        { $match: {} },
        {
          $merge: {
            into: { db: targetDbName, coll: collName },
            on: '_id',
            whenMatched: 'keepExisting',
            whenNotMatched: 'insert'
          }
        }
      ];

      await sourceColl.aggregate(pipeline, { allowDiskUse: true }).toArray().catch(() => {});

      const tgtCountAfter = await targetColl.countDocuments().catch(() => 0);
      console.log(`   Destino (${targetDbName}) después: ${tgtCountAfter} docs`);
      console.log('   ✅ Clonado/merge completado');
    } catch (err) {
      console.error(`   ❌ Error en colección ${collName}:`, err?.message || err);
    }
  }

  await conn.close();
  console.log('\n🎉 Proceso finalizado');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error general:', err);
  process.exit(1);
});



