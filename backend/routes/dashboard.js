const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

// Obtener estadísticas del dashboard por contacto de usuario
router.get('/stats/:contact', async (req, res) => {
  try {
    const { contact } = req.params;
    console.log('📊 Obteniendo estadísticas para usuario con contacto:', contact);
    
    // Buscar usuario por celular (contact puede ser número o string)
    const contactNum = typeof contact === 'string' && !isNaN(contact) ? parseInt(contact) : contact;
    const user = await User.findOne({ celular: contactNum });
    
    if (!user) {
      console.log('⚠️ Usuario no encontrado con contacto:', contact);
      return res.json({
        totalSales: 0,
        totalCustomers: 0,
        totalProducts: 0,
        productsSold: 0,
        salesGrowth: 0,
        customersGrowth: 0,
        productsGrowth: 0,
        soldGrowth: 0
      });
    }
    
    // Obtener productos del usuario
    const products = await Product.find({ Contact: contact });
    console.log(`📦 Productos encontrados: ${products.length}`);
    
    // Obtener órdenes del comerciante
    const orders = await Order.find({ merchantId: user._id });
    console.log(`📋 Órdenes encontradas: ${orders.length}`);
    
    // Calcular estadísticas
    const totalProducts = products.length;
    const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalCustomers = new Set(orders.map(o => o.customerEmail)).size;
    const productsSold = orders.reduce((sum, order) => {
      return sum + (order.items || []).reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
    }, 0);
    
    // Calcular crecimiento del mes anterior
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthOrders = await Order.find({ 
      merchantId: user._id,
      createdAt: { $gte: lastMonth } 
    });
    const lastMonthSales = lastMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const salesGrowth = totalSales > 0 ? Math.round(((totalSales - lastMonthSales) / totalSales) * 100) : 0;
    
    const stats = {
      totalSales: totalSales,
      totalCustomers: totalCustomers,
      totalProducts: totalProducts,
      productsSold: productsSold,
      salesGrowth: salesGrowth,
      customersGrowth: 0, // Por ahora 0, se puede calcular comparando períodos
      productsGrowth: 0,  // Por ahora 0
      soldGrowth: 0       // Por ahora 0
    };
    
    console.log('📊 Estadísticas calculadas:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
});

// Obtener órdenes del usuario por contacto
router.get('/orders/:contact', async (req, res) => {
  try {
    const { contact } = req.params;
    console.log('📋 Obteniendo órdenes para usuario con contacto:', contact);
    
    // Buscar usuario por celular
    const contactNum = typeof contact === 'string' && !isNaN(contact) ? parseInt(contact) : contact;
    const user = await User.findOne({ celular: contactNum });
    
    if (!user) {
      console.log('⚠️ Usuario no encontrado con contacto:', contact);
      return res.json([]);
    }
    
    // Obtener órdenes del comerciante
    const orders = await Order.find({ merchantId: user._id })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    
    // Formatear órdenes para el frontend
    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      client: order.customerName || (order.customerId?.name || 'Cliente'),
      name: `Orden ${order.orderNumber}`,
      date: order.createdAt,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      products: (order.items || []).map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      }))
    }));
    
    console.log(`📋 Órdenes encontradas: ${formattedOrders.length}`);
    res.json(formattedOrders);
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