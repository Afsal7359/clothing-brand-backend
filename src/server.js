import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import productRoutes from './routes/products.js';
import collectionRoutes from './routes/collections.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';
import authRoutes from './routes/auth.js';
import couponRoutes from './routes/coupon.js';
import stripeRoutes from './routes/stripe.js';
import eventRoutes from './routes/events.js';
import adminAnalyticsRoutes from './routes/adminAnalytics.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Stripe webhook needs raw body — must come BEFORE express.json()
app.use('/api/stripe', stripeRoutes);

// Rate limit mutating endpoints
app.use('/api/admin/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
app.use('/api/auth/signup', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));
app.use('/api/auth/resend-otp', rateLimit({ windowMs: 5 * 60 * 1000, max: 3 }));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// API routes
app.use('/api/products',           productRoutes);
app.use('/api/collections',        collectionRoutes);
app.use('/api/orders',             orderRoutes);
app.use('/api/admin',              adminRoutes);
app.use('/api/admin/analytics',    adminAnalyticsRoutes);
app.use('/api/settings',           settingsRoutes);
app.use('/api/auth',               authRoutes);
app.use('/api/coupons',            couponRoutes);
app.use('/api/events',             rateLimit({ windowMs: 60 * 1000, max: 300 }), eventRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`[server] running on :${PORT}`)))
  .catch((err) => {
    console.error('[server] failed to start', err);
    process.exit(1);
  });
