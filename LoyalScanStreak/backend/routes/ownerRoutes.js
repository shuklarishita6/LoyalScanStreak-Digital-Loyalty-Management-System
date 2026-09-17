const express = require('express');
const router = express.Router();
const { registerOwner, loginOwner, getOwnerProfile } = require('../controllers/ownerController');
const { protect } = require('../middleware/authMiddleware');
const { ownerOnly } = require('../middleware/roleMiddleware');

router.post('/register', registerOwner);
router.post('/login', loginOwner);
router.get('/profile', protect, ownerOnly, getOwnerProfile);

module.exports = router;
