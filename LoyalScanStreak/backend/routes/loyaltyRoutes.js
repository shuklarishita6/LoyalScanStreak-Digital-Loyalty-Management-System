const express = require('express');
const router = express.Router();
const { updateLoyalty, getLoyaltyHistory } = require('../controllers/loyaltyController');
const { protect } = require('../middleware/authMiddleware');
const { ownerOnly } = require('../middleware/roleMiddleware');

router.post('/update', protect, ownerOnly, updateLoyalty);
router.get('/history/:customerId', protect, ownerOnly, getLoyaltyHistory);

module.exports = router;
