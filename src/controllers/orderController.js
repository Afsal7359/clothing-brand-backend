import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { email, items, shippingAddress, paymentMethod = 'cod', notes = '' } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }

  // Rebuild items server-side from DB to prevent price tampering
  const enriched = [];
  let subtotal = 0;
  for (const it of items) {
    const product = await Product.findById(it.product);
    if (!product) {
      res.status(400);
      throw new Error(`Product not found: ${it.product}`);
    }
    const qty = Math.max(1, Number(it.quantity) || 1);
    const lineTotal = product.price * qty;
    subtotal += lineTotal;
    enriched.push({
      product: product._id,
      title: product.title,
      image: product.images?.[0] || '',
      price: product.price,
      quantity: qty,
      size: it.size || '',
    });
  }

  const shippingFee = subtotal >= 2500 ? 0 : 99;
  const total = subtotal + shippingFee;

  const order = await Order.create({
    email,
    items: enriched,
    shippingAddress,
    subtotal,
    shippingFee,
    total,
    paymentMethod,
    notes,
  });

  res.status(201).json(order);
});

export const listOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 25 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Order.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();
  res.json(order);
});
