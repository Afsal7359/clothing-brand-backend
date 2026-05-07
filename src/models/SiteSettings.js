import mongoose from 'mongoose';
const { Schema } = mongoose;

const siteSettingsSchema = new Schema({
  hero: {
    desktop: { type: String, default: '' },
    mobile:  { type: String, default: '' },
    eyebrow: { type: String, default: 'SS26 — Drop 01' },
    title:   { type: String, default: 'Built For The Street' },
    ctaLabel:{ type: String, default: 'Shop the collection' },
    ctaHref: { type: String, default: '/collections' },
  },
  stories: [{ label: String, image: String, href: String }],
  stores:  [{ city: String, address: String, image: String, directionsUrl: String, phone: String, isOpen: { type: Boolean, default: true } }],
  craft: {
    image:    { type: String, default: '' },
    products: [{
      _id:            { type: String },
      title:          { type: String },
      price:          { type: Number },
      compareAtPrice: { type: Number },
      images:         [{ type: String }],
      slug:           { type: String },
      isNew:          { type: Boolean },
    }],
  },
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);
