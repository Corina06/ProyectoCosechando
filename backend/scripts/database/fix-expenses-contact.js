// Script para migrar comercianteContact de email a celular en expenses
// Uso: node scripts/database/fix-expenses-contact.js

require('dotenv').config();
const mongoose = require('mongoose');
const Expense = require('../../models/expense');
const User = require('../../models/user');

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI no está definida');
    process.exit(1);
  }

  console.log('🔌 Conectando a MongoDB...');
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || 'cosechando' });
  console.log('✅ Conectado');

  try {
    // Obtener todos los expenses que tienen email como comercianteContact
    const expenses = await Expense.find({
      comercianteContact: { $regex: /@/ } // Que contenga @ (email)
    });

    console.log(`📦 Encontrados ${expenses.length} expenses con email como contacto`);

    let updated = 0;
    let skipped = 0;

    for (const expense of expenses) {
      const email = expense.comercianteContact;
      
      // Buscar usuario por email
      const user = await User.findOne({ email: email });
      
      if (user && user.celular) {
        // Actualizar expense con el celular del usuario
        expense.comercianteContact = String(user.celular);
        await expense.save();
        console.log(`✅ Actualizado: ${email} -> ${user.celular}`);
        updated++;
      } else {
        console.log(`⚠️ Usuario no encontrado o sin celular para: ${email}`);
        skipped++;
      }
    }

    console.log(`\n🎉 Migración completada:`);
    console.log(`   ✅ Actualizados: ${updated}`);
    console.log(`   ⚠️ Omitidos: ${skipped}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en migración:', err);
    process.exit(1);
  }
}

run();

