import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/', protect, listOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id/status', protect, updateOrderStatus);

export default router;
