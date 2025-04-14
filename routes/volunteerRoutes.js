const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { authenticate, authorizeSuperAdmin } = require('../middlewares/authMiddleware');

// Public route for volunteer registration
router.post('/register', volunteerController.registerVolunteer);
router.get('/active', volunteerController.getActiveVolunteers); // Public endpoint for active volunteers

// Protected routes (SUPERADMIN only)
router.get('/', authenticate, authorizeSuperAdmin, volunteerController.getAllVolunteers);
router.get('/:volunteerId', authenticate, authorizeSuperAdmin, volunteerController.getVolunteerById);
router.put('/:volunteerId/status', authenticate, authorizeSuperAdmin, volunteerController.updateVolunteerStatus);

// New route for making a volunteer into an admin
router.post('/:volunteerId/make-admin', authenticate, authorizeSuperAdmin, volunteerController.createAdminFromVolunteer);

module.exports = router;