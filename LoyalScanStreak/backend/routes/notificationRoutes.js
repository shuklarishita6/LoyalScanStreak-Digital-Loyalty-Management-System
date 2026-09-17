const express = require('express');
const router = express.Router();
const { getMyNotifications, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// No ownerOnly/customerOnly here on purpose - protect() already resolved
// req.userRole, and the controller filters by whichever role is logged in.
router.get('/', protect, getMyNotifications);
router.patch('/read-all', protect, markAllRead);

module.exports = router;
