import asyncHandler from 'express-async-handler';
import SiteSettings from '../models/SiteSettings.js';

const DEFAULTS = {
  hero: {
    desktop: 'https://picsum.photos/seed/herodesk/1920/1080',
    mobile:  'https://picsum.photos/seed/heromob/900/1200',
    eyebrow: 'SS26 — Drop 01',
    title:   'Built For The Street',
    ctaLabel:'Shop the collection',
    ctaHref: '/collections',
  },
  stories: [
    { label: 'new caps',    image: 'https://picsum.photos/seed/story1/200/200', href: '/collections/caps' },
    { label: 'polo season', image: 'https://picsum.photos/seed/story2/200/200', href: '/collections/polo-club' },
    { label: 'dark grid',   image: 'https://picsum.photos/seed/story3/200/200', href: '/collections' },
    { label: 'new shirts',  image: 'https://picsum.photos/seed/story4/200/200', href: '/collections' },
    { label: 'ss26 look',   image: 'https://picsum.photos/seed/story5/200/200', href: '/collections' },
    { label: 'lookbook',    image: 'https://picsum.photos/seed/story6/200/200', href: '/collections' },
    { label: 'archive',     image: 'https://picsum.photos/seed/story7/200/200', href: '/collections' },
    { label: 'press',       image: 'https://picsum.photos/seed/story8/200/200', href: '/collections' },
  ],
  stores: [
    { city: 'Delhi',     address: 'Greater Kailash II, New Delhi, 110048',  image: 'https://picsum.photos/seed/delhi/800/500',     directionsUrl: '#', phone: '+910000000000', isOpen: true },
    { city: 'Mumbai',    address: '14th Rd, Khar West, Mumbai, 400052',     image: 'https://picsum.photos/seed/mumbai/800/500',    directionsUrl: '#', phone: '+910000000000', isOpen: true },
    { city: 'Hyderabad', address: 'Banjara Hills, Hyderabad, 500034',       image: 'https://picsum.photos/seed/hyderabad/800/500', directionsUrl: '#', phone: '+910000000000', isOpen: true },
    { city: 'Ahmedabad', address: 'Ashok Vatika, Ahmedabad, 380058',        image: 'https://picsum.photos/seed/ahmedabad/800/500', directionsUrl: '#', phone: '+910000000000', isOpen: true },
    { city: 'Gurugram',  address: 'DLF Phase 3, Gurugram, 122010',          image: 'https://picsum.photos/seed/gurugram/800/500',  directionsUrl: '#', phone: '+910000000000', isOpen: true },
    { city: 'Bengaluru', address: 'Indiranagar, Bengaluru, 560038',         image: 'https://picsum.photos/seed/bengaluru/800/500', directionsUrl: '#', phone: '+910000000000', isOpen: true },
  ],
};

// GET /api/settings  — public, find-or-create singleton
export const getSettings = asyncHandler(async (req, res) => {
  let s = await SiteSettings.findOne();
  if (!s) s = await SiteSettings.create(DEFAULTS);
  res.json(s);
});

// PUT /api/admin/settings  — protected
export const updateSettings = asyncHandler(async (req, res) => {
  const { hero, stories, stores } = req.body;
  let s = await SiteSettings.findOne();
  if (!s) {
    s = await SiteSettings.create({ hero, stories, stores });
  } else {
    if (hero    !== undefined) s.hero    = hero;
    if (stories !== undefined) s.stories = stories;
    if (stores  !== undefined) s.stores  = stores;
    await s.save();
  }
  res.json(s);
});
