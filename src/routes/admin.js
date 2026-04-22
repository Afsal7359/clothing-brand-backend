import { Router } from 'express';
import { login, me } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { updateSettings } from '../controllers/settingsController.js';

const router = Router();

router.post('/login', login);
router.get('/me', protect, me);
router.put('/settings', protect, updateSettings);

// Upload endpoint — accepts up to 10 images, returns their paths
router.post('/upload', protect, upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const urls = req.files.map((f) => f.path);
  res.json({ urls });
});

export default router;
