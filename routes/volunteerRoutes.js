const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { authenticate, authorizeSuperAdmin } = require('../middlewares/authMiddleware');

// Public route for volunteer registration
router.post('/register', volunteerController.registerVolunteer);

// Protected routes (SUPERADMIN only)
router.get('/', authenticate, authorizeSuperAdmin, volunteerController.getAllVolunteers);
router.get('/:volunteerId', authenticate, authorizeSuperAdmin, volunteerController.getVolunteerById);
router.put('/:volunteerId/status', authenticate, authorizeSuperAdmin, volunteerController.updateVolunteerStatus);

module.exports = router;