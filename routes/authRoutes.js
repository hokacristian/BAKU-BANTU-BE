const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');
const { authenticate, authorizeSuperAdmin } = require('../middlewares/authMiddleware');

// Setup multer for file upload
const upload = multer({ 
  storage: multer.memoryStorage(),
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
router.post('/register/superadmin', authController.registerSuperAdmin);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.post('/create-admin', authenticate, authorizeSuperAdmin, upload.single('profileImage'), authController.createAdmin);
router.get('/admins', authenticate, authorizeSuperAdmin, authController.getAllAdmins);

// Admin management routes (SUPERADMIN only)
router.delete('/admin/:adminId', authenticate, authorizeSuperAdmin, authController.deleteAdmin);
router.post('/admin/:adminId/reset-password', authenticate, authorizeSuperAdmin, authController.resetAdminPassword);

// Password change route (ADMIN and SUPERADMIN)
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;