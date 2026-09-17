const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  getCustomerByCustomerId,
  getAllCustomers,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');
const { ownerOnly, customerOnly } = require('../middleware/roleMiddleware');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

router.get('/profile', protect, customerOnly, getCustomerProfile);

// Owner-only: browse / search all customers, and look one up by ID (QR scan result)
router.get('/lookup/:customerId', protect, ownerOnly, getCustomerByCustomerId);
router.get('/', protect, ownerOnly, getAllCustomers);

module.exports = router;
