const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Obtener estadísticas del dashboard por contacto de usuario
router.get('/stats/:contact', async (req, res) => {
  try {
    const { contact } = req.params;
    console.log('📊 Obteniendo estadísticas para usuario con contacto:', contact);
    
    // Obtener productos del usuario
    const products = await Product.find({ Contact: contact });
    console.log(`📦 Productos encontrados: ${products.length}`);
    
    // Calcular estadísticas básicas
    const totalProducts = products.length;
    const totalSales = 0; // Por ahora 0, se implementará con órdenes reales
    const totalCustomers = 0; // Por ahora 0, se implementará con órdenes reales
    const productsSold = 0; // Por ahora 0, se implementará con órdenes reales
    
    const stats = {
      totalSales: totalSales,
      totalCustomers: totalCustomers,
      totalProducts: totalProducts,
      productsSold: productsSold,
      salesGrowth: 0,
      customersGrowth: 0,
      productsGrowth: 0,
      soldGrowth: 0
    };
    
    console.log('📊 Estadísticas calculadas:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
});

// Obtener órdenes del usuario (por ahora vacío)
router.get('/orders/:contact', async (req, res) => {
  try {
    const { contact } = req.params;
    console.log('📋 Obteniendo órdenes para usuario con contacto:', contact);
    
    // Por ahora devolver array vacío - se implementará cuando tengamos modelo de órdenes
    const orders = [];
    
    console.log(`📋 Órdenes encontradas: ${orders.length}`);
    res.json(orders);
  } catch (error) {
    console.error('❌ Error obteniendo órdenes:', error);
    res.status(500).json({ message: 'Error al obtener órdenes', error: error.message });
  }
});

// Rutas originales (comentadas por ahora)
// const { 
//   getDashboardStats, 
//   getMerchantOrders, 
//   getSalesReport, 
//   getTopProducts 
// } = require('../controllers/dashboardController');
// const authMiddleware = require('../middleware/auth');

// router.use(authMiddleware);
// router.get('/stats', getDashboardStats);
// router.get('/orders', getMerchantOrders);
// router.get('/sales-report', getSalesReport);
// router.get('/top-products', getTopProducts);

module.exports = router;