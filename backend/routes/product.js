const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST crear producto
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT actualizar producto
router.put('/:id', async (req, res) => {
  try {
    console.log('🔄 Actualizando producto con ID:', req.params.id);
    console.log('📝 Datos recibidos:', req.body);
    
    const product = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id) }, 
      req.body, 
      { new: true }
    );
    
    if (!product) {
      console.log('❌ Producto no encontrado con ID:', req.params.id);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    console.log('✅ Producto actualizado exitosamente:', product);
    res.json(product);
  } catch (err) {
    console.error('❌ Error actualizando producto:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
