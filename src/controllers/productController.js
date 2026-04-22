import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

export const listProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    collection,
    minPrice,
    maxPrice,
    featured,
    isNew,
    status = 'active',
    sort = '-createdAt',
    page = 1,
    limit = 24,
  } = req.query;

  const filter = { status };
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (collection) filter.collections = collection;
  if (featured === 'true') filter.isFeatured = true;
  if (isNew === 'true') filter.isNew = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(Number(limit)).populate('collections', 'title slug'),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const product = await Product.findOne(isId ? { _id: idOrSlug } : { slug: idOrSlug })
    .populate('collections', 'title slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ message: 'Product deleted' });
});
