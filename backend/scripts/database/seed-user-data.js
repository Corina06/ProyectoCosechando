// Seed de productos, compras (expenses) y ventas (orders) para un usuario específico
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../../models/user');
const Product = require('../../models/product');
const Order = require('../../models/order');
const Expense = require('../../models/expense');

async function connect() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando';
  console.log('🔌 Conectando a MongoDB:', uri.includes('localhost') ? 'LOCAL' : 'ATLAS');
  await mongoose.connect(uri);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedForEmail(email) {
  await connect();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ Usuario con email ${email} no encontrado`);
      process.exit(1);
    }
    console.log('👤 Usuario encontrado:', { id: user._id.toString(), name: user.name, email: user.email });

    // 1) Crear 5 productos sin fotos (usar placeholder)
    const placeholderImg = '/assets/images/placeholder.svg';
    const baseProducts = [
      { name: 'Tomate perita', category: 'Verduras', price: 1.2, description: 'Tomate fresco perita', unit: 'kilo' },
      { name: 'Lechuga crespa', category: 'Verduras', price: 0.9, description: 'Lechuga crujiente', unit: 'unidad' },
      { name: 'Banano', category: 'Frutas', price: 1.1, description: 'Banano maduro', unit: 'kilo' },
      { name: 'Papa blanca', category: 'Raíces', price: 0.8, description: 'Papa para cocción', unit: 'kilo' },
      { name: 'Cebolla morada', category: 'Verduras', price: 1.5, description: 'Cebolla aromática', unit: 'kilo' }
    ];

    const productsToInsert = baseProducts.map((p, idx) => ({
      id: randomInt(10000, 99999),
      name: p.name,
      category: p.category,
      price: p.price,
      purchasePrice: Number((p.price * 0.7).toFixed(2)),
      image: placeholderImg,
      description: p.description,
      location: 'Merca Panamá',
      CName: user.name || 'Comerciante',
      Contact: user.email, // usamos email como identificador de contacto
      stock: true,
      quantity: randomInt(10, 100),
      unit: p.unit,
      minStock: 5
    }));

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ Productos creados: ${createdProducts.length}`);

    // 2) Crear 5 compras (expenses) para el comerciante
    const today = new Date();
    const toDateStr = (d) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    const expensesToInsert = Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const item = createdProducts[i % createdProducts.length];
      const qty = randomInt(5, 20);
      const price = item.purchasePrice || Number((item.price * 0.7).toFixed(2));
      const subtotal = Number((qty * price).toFixed(2));
      return {
        id: randomInt(10000, 99999),
        comercianteContact: String(user.celular || user.email), // Usar celular si existe, sino email
        proveedor: 'Proveedor Genérico',
        tipoGasto: 'Compra de Productos',
        fecha: toDateStr(d),
        estado: 'Pagado',
        metodoPago: 'Transferencia Bancaria',
        factura: `FAC-${randomInt(1000, 9999)}`,
        descripcion: `Compra de ${item.name}`,
        items: [
          {
            nombre: item.name,
            cantidad: qty,
            precio: price,
            unit: item.unit || 'unidad',
            subtotal
          }
        ],
        total: subtotal
      };
    });

    await Expense.insertMany(expensesToInsert);
    console.log('✅ Compras (expenses) creadas: 5');

    // 3) Crear 5 ventas (orders) para el comerciante como merchantId
    const sampleCustomers = [
      { name: 'Cliente A', email: 'cliente.a@example.com' },
      { name: 'Cliente B', email: 'cliente.b@example.com' },
      { name: 'Cliente C', email: 'cliente.c@example.com' },
      { name: 'Cliente D', email: 'cliente.d@example.com' },
      { name: 'Cliente E', email: 'cliente.e@example.com' }
    ];

    for (let i = 0; i < 5; i++) {
      const itemsPicked = [createdProducts[i % createdProducts.length], createdProducts[(i + 1) % createdProducts.length]];
      const orderItems = itemsPicked.map(p => {
        const qty = randomInt(1, 4);
        const total = Number((qty * p.price).toFixed(2));
        return {
          productId: p._id,
          productName: p.name,
          quantity: qty,
          price: p.price,
          total
        };
      });
      const subtotal = Number(orderItems.reduce((s, it) => s + it.total, 0).toFixed(2));
      const cust = sampleCustomers[i];
      const order = new Order({
        orderNumber: `ORD-${Date.now()}-${randomInt(1000,9999)}`,
        customerId: user._id, // si tu app espera cliente separado, ajustar
        customerName: cust.name,
        customerEmail: cust.email,
        merchantId: user._id,
        items: orderItems,
        subtotal,
        total: subtotal,
        status: 'Entregado',
        paymentStatus: 'Pagado',
        shippingAddress: { street: 'N/A', city: 'Panamá', state: 'PA', zipCode: '00000' },
        notes: `Venta de ejemplo #${i + 1}`
      });
      await order.save();
      console.log('🧾 Venta creada:', order.orderNumber);
    }
    console.log('✅ Ventas (orders) creadas: 5');

    console.log('🎉 Seed para usuario completado');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  }
}

const targetEmail = process.argv[2] || 'cosechando@gmail.com';
seedForEmail(targetEmail);


