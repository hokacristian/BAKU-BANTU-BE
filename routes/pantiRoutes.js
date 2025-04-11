const express = require('express');
const router = express.Router();
const multer = require('multer');
const pantiController = require('../controllers/pantiController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

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

// Routes untuk daftar panti
router.post('/', authenticate, authorizeAdmin, upload.single('gambar'), pantiController.createDaftarPanti);
router.get('/', pantiController.getAllDaftarPanti);
router.get('/:daftarPantiId', pantiController.getDaftarPantiById);

// Routes untuk detail panti
router.post('/:daftarPantiId/detail', authenticate, authorizeAdmin, pantiController.createDetailPanti);
router.post('/:daftarPantiId/details', authenticate, authorizeAdmin, pantiController.createManyDetailPanti);
router.get('/detail/:detailPantiId', pantiController.getDetailPantiById);

module.exports = router;