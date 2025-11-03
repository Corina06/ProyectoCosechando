const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getMerchantOrders, 
  getSalesReport, 
  getTopProducts 
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas del dashboard
router.get('/stats', getDashboardStats);
router.get('/orders', getMerchantOrders);
router.get('/sales-report', getSalesReport);
router.get('/top-products', getTopProducts);

module.exports = router;