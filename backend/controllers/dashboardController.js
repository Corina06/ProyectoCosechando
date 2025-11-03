const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

// Obtener estadísticas del dashboard
const getDashboardStats = async (req, res) => {
  try {
    const merchantId = req.user.id; // Asumiendo que tienes middleware de autenticación

    // Obtener órdenes del comerciante
    const orders = await Order.find({ merchantId });
    
    // Calcular estadísticas
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    
    // Obtener productos del comerciante
    const products = await Product.find({ merchantId });
    const totalProducts = products.length;
    
    // Calcular productos vendidos
    const productsSold = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    // Calcular estadísticas del mes anterior para comparación
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthOrders = await Order.find({ 
      merchantId, 
      createdAt: { $gte: lastMonth } 
    });
    
    const lastMonthSales = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Calcular crecimiento (simulado por ahora)
    const salesGrowth = totalSales > 0 ? Math.round(((totalSales - lastMonthSales) / totalSales) * 100) : 0;
    
    res.json({
      totalSales: totalSales,
      totalCustomers: totalOrders, // Por simplicidad, usamos número de órdenes
      totalProducts: totalProducts,
      productsSold: productsSold,
      salesGrowth: salesGrowth,
      customersGrowth: 15, // Simulado
      productsGrowth: -5,  // Simulado
      soldGrowth: 10       // Simulado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

// Obtener órdenes del comerciante
const getMerchantOrders = async (req, res) => {
  try {
    const merchantId = req.user.id;
    
    const orders = await Order.find({ merchantId })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      client: order.customerName,
      name: `Orden ${order.orderNumber}`,
      date: order.createdAt,
      total: order.total,
      status: order.status,
      products: order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener órdenes', error: error.message });
  }
};

// Obtener reporte de ventas
const getSalesReport = async (req, res) => {
  try {
    const merchantId = req.user.id;
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
        break;
      case 'month':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
        break;
      case 'year':
        dateFilter = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
        break;
    }

    const salesData = await Order.aggregate([
      { $match: { merchantId: merchantId, createdAt: dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedData = salesData.map(item => ({
      date: item._id,
      amount: item.amount,
      orders: item.orders
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reporte de ventas', error: error.message });
  }
};

// Obtener productos más vendidos
const getTopProducts = async (req, res) => {
  try {
    const merchantId = req.user.id;
    
    const topProducts = await Order.aggregate([
      { $match: { merchantId: merchantId } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.productName" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.total" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos más vendidos', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getMerchantOrders,
  getSalesReport,
  getTopProducts
};