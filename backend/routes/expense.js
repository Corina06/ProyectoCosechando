const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

// GET todos los gastos de un comerciante
router.get('/user/:contact', async (req, res) => {
  try {
    console.log('🔍 Buscando gastos para comerciante con contacto:', req.params.contact);
    const expenses = await Expense.find({ comercianteContact: req.params.contact })
                                  .sort({ createdAt: -1 }); // Más recientes primero
    console.log(`📦 Encontrados ${expenses.length} gastos para el comerciante`);
    res.json(expenses);
  } catch (err) {
    console.error('❌ Error obteniendo gastos por comerciante:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET todos los gastos (admin)
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST crear nuevo gasto
router.post('/', async (req, res) => {
  try {
    console.log('💰 Creando nuevo gasto:', req.body);
    
    // Generar ID único si no se proporciona
    if (!req.body.id) {
      req.body.id = Date.now();
    }
    
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    
    console.log('✅ Gasto creado exitosamente:', savedExpense.id);
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error('❌ Error creando gasto:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET gasto por ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({ id: parseInt(req.params.id) });
    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT actualizar gasto
router.put('/:id', async (req, res) => {
  try {
    console.log('🔄 Actualizando gasto con ID:', req.params.id);
    console.log('📝 Datos recibidos:', req.body);
    
    const expense = await Expense.findOneAndUpdate(
      { id: parseInt(req.params.id) }, 
      req.body, 
      { new: true }
    );
    
    if (!expense) {
      console.log('❌ Gasto no encontrado con ID:', req.params.id);
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }
    
    console.log('✅ Gasto actualizado exitosamente:', expense);
    res.json(expense);
  } catch (err) {
    console.error('❌ Error actualizando gasto:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE eliminar gasto
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }
    res.json({ message: 'Gasto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET estadísticas de gastos por comerciante
router.get('/stats/:contact', async (req, res) => {
  try {
    const contact = req.params.contact;
    
    // Total de gastos
    const totalExpenses = await Expense.countDocuments({ comercianteContact: contact });
    
    // Suma total de gastos
    const totalAmount = await Expense.aggregate([
      { $match: { comercianteContact: contact } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    // Gastos por tipo
    const expensesByType = await Expense.aggregate([
      { $match: { comercianteContact: contact } },
      { $group: { _id: '$tipoGasto', total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);
    
    // Gastos por estado
    const expensesByStatus = await Expense.aggregate([
      { $match: { comercianteContact: contact } },
      { $group: { _id: '$estado', total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalExpenses,
      totalAmount: totalAmount[0]?.total || 0,
      expensesByType,
      expensesByStatus
    });
  } catch (err) {
    console.error('❌ Error obteniendo estadísticas de gastos:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;