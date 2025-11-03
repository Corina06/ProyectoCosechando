// Script para crear órdenes de ejemplo para Ana
require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/order');
const User = require('./models/user');

const seedAnaOrders = async () => {
  try {
    console.log('🛒 Creando órdenes de ejemplo para Ana...');
    
    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Buscar a Ana
    const ana = await User.findOne({ email: 'ana.gonzalez@cosechando.com' });
    if (!ana) {
      console.log('❌ Ana no encontrada en la base de datos');
      return;
    }

    console.log('👩‍💼 Ana encontrada:', ana.name);

    // Verificar si ya existen órdenes para Ana
    const existingOrders = await Order.find({ merchantId: ana._id });
    if (existingOrders.length > 0) {
      console.log(`ℹ️ Ana ya tiene ${existingOrders.length} órdenes`);
      return;
    }

    // Crear un cliente de ejemplo
    const cliente = new User({
      name: 'María',
      apellido: 'Rodríguez',
      email: 'maria.rodriguez@email.com',
      direccion: 'Calle 45, San Francisco',
      local: 'N/A',
      puesto: 'N/A',
      celular: 62345678,
      fecha: new Date('1990-03-15'),
      banco: 'N/A',
      tipo: 'N/A',
      cuenta: 0,
      password: 'cliente123'
    });
    
    await cliente.save();
    console.log('👤 Cliente creado:', cliente.name);

    // Crear órdenes de ejemplo
    const ordersData = [
      {
        merchantId: ana._id,
        customerId: cliente._id,
        orderNumber: 'ORD-001',
        customerName: 'María Rodríguez',
        customerEmail: 'maria.rodriguez@email.com',
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Tomates Cherry',
            quantity: 2,
            price: 3.50,
            total: 7.00
          },
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Lechuga Romana',
            quantity: 1,
            price: 2.25,
            total: 2.25
          }
        ],
        subtotal: 9.25,
        total: 9.25,
        status: 'Entregado',
        paymentStatus: 'Pagado',
        notes: 'Entregar en la mañana'
      },
      {
        merchantId: ana._id,
        customerId: cliente._id,
        orderNumber: 'ORD-002',
        customerName: 'Carlos Mendoza',
        customerEmail: 'carlos.mendoza@email.com',
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Papas Rojas',
            quantity: 5,
            price: 1.50,
            total: 7.50
          },
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Cebolla Blanca',
            quantity: 2,
            price: 1.25,
            total: 2.50
          }
        ],
        subtotal: 10.00,
        total: 10.00,
        status: 'Pendiente',
        paymentStatus: 'Pendiente',
        notes: 'Cliente prefiere entrega por la tarde'
      },
      {
        merchantId: ana._id,
        customerId: cliente._id,
        orderNumber: 'ORD-003',
        customerName: 'Ana Sofía López',
        customerEmail: 'anasofia.lopez@email.com',
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Yuca Fresca',
            quantity: 3,
            price: 2.00,
            total: 6.00
          },
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Plátanos Verdes',
            quantity: 6,
            price: 0.75,
            total: 4.50
          }
        ],
        subtotal: 10.50,
        total: 10.50,
        status: 'En proceso',
        paymentStatus: 'Pagado',
        notes: 'Llamar antes de entregar'
      },
      {
        merchantId: ana._id,
        customerId: cliente._id,
        orderNumber: 'ORD-004',
        customerName: 'Roberto Silva',
        customerEmail: 'roberto.silva@email.com',
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Zanahorias',
            quantity: 2,
            price: 1.75,
            total: 3.50
          },
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Apio',
            quantity: 1,
            price: 2.50,
            total: 2.50
          }
        ],
        subtotal: 6.00,
        total: 6.00,
        status: 'Entregado',
        paymentStatus: 'Pagado',
        notes: 'Productos orgánicos solicitados'
      },
      {
        merchantId: ana._id,
        customerId: cliente._id,
        orderNumber: 'ORD-005',
        customerName: 'Lucía Herrera',
        customerEmail: 'lucia.herrera@email.com',
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Cilantro Fresco',
            quantity: 3,
            price: 0.50,
            total: 1.50
          },
          {
            productId: new mongoose.Types.ObjectId(),
            productName: 'Pimientos Rojos',
            quantity: 4,
            price: 2.25,
            total: 9.00
          }
        ],
        subtotal: 10.50,
        total: 10.50,
        status: 'Entregado',
        paymentStatus: 'Pagado',
        notes: 'Cliente regular'
      }
    ];

    // Insertar órdenes
    const createdOrders = await Order.insertMany(ordersData);
    console.log(`✅ ${createdOrders.length} órdenes creadas para Ana`);

    // Actualizar estadísticas de Ana
    const totalVentas = ordersData.reduce((sum, order) => sum + order.total, 0);
    await User.findByIdAndUpdate(ana._id, {
      totalVentas: totalVentas,
      productosActivos: 16
    });

    console.log(`💰 Total de ventas actualizado: $${totalVentas}`);
    console.log('🎉 Órdenes de ejemplo creadas exitosamente');

  } catch (error) {
    console.error('❌ Error al crear órdenes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedAnaOrders().then(() => {
    console.log('✨ Proceso completado');
    process.exit(0);
  });
}

module.exports = { seedAnaOrders };