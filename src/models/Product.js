import mongoose from 'mongoose';
import slugify from 'slugify';

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },

    images: [{ type: String }],

    category: {
      type: String,
      enum: ['tshirts', 'hoodies', 'jackets', 'shirts', 'sweatshirts', 'polos', 'pants', 'shorts', 'caps', 'bags', 'other'],
      default: 'tshirts',
    },
    tags: [{ type: String }],
    colors: [{ type: String }],
    variants: [variantSchema],

    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],

    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active', index: true },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: true },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('validate', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

productSchema.virtual('inStock').get(function () {
  return this.variants.reduce((sum, v) => sum + (v.stock || 0), 0) > 0;
});

productSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Product', productSchema);
