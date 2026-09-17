const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');
const generateToken = require('../utils/generateToken');
const { generateCustomerId } = require('../utils/generateId');

// @desc   Register a new customer
// @route  POST /api/customers/register
const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const customerId = await generateCustomerId();

    const customer = await Customer.create({ customerId, name, email, phone, passwordHash });

    res.status(201).json({
      _id: customer._id,
      customerId: customer.customerId,
      name: customer.name,
      email: customer.email,
      loyaltyPoints: customer.loyaltyPoints,
      token: generateToken(customer._id, 'customer'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login a customer
// @route  POST /api/customers/login
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email: email?.toLowerCase() });

    if (!customer || !(await bcrypt.compare(password, customer.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: customer._id,
      customerId: customer.customerId,
      name: customer.name,
      email: customer.email,
      loyaltyPoints: customer.loyaltyPoints,
      token: generateToken(customer._id, 'customer'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get the logged-in customer's own profile (fresh points count)
// @route  GET /api/customers/profile
const getCustomerProfile = async (req, res) => {
  res.json(req.user);
};

// @desc   Owner looks up one customer by their customerId (after QR scan / manual entry)
// @route  GET /api/customers/lookup/:customerId
const getCustomerByCustomerId = async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.customerId }).select('-passwordHash');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Owner sees all registered customers, optionally filtered by search text
// @route  GET /api/customers?search=riya
const getAllCustomers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { customerId: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const customers = await Customer.find(filter).select('-passwordHash').sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  getCustomerByCustomerId,
  getAllCustomers,
};
