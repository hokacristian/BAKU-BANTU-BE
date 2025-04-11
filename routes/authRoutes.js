const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');
const { authenticate, authorizeSuperAdmin } = require('../middlewares/authMiddleware');

// Setup multer for file upload
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Public routes
router.post('/register/superadmin', upload.single('profileImage'), authController.registerSuperAdmin);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.post('/create-admin', authenticate, authorizeSuperAdmin, upload.single('profileImage'), authController.createAdmin);

module.exports = router;