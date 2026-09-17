const bcrypt = require('bcryptjs');
const ShopOwner = require('../models/ShopOwner');
const generateToken = require('../utils/generateToken');
const { generateShopId } = require('../utils/generateId');

// @desc   Register a new shop owner
// @route  POST /api/owners/register
const registerOwner = async (req, res) => {
  try {
    const { shopName, ownerName, email, password } = req.body;

    if (!shopName || !ownerName || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existing = await ShopOwner.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const shopId = await generateShopId();

    const owner = await ShopOwner.create({ shopId, shopName, ownerName, email, passwordHash });

    res.status(201).json({
      _id: owner._id,
      shopId: owner.shopId,
      shopName: owner.shopName,
      ownerName: owner.ownerName,
      email: owner.email,
      token: generateToken(owner._id, 'owner'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login a shop owner
// @route  POST /api/owners/login
const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await ShopOwner.findOne({ email: email?.toLowerCase() });

    if (!owner || !(await bcrypt.compare(password, owner.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: owner._id,
      shopId: owner.shopId,
      shopName: owner.shopName,
      ownerName: owner.ownerName,
      email: owner.email,
      token: generateToken(owner._id, 'owner'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get the logged-in owner's own profile
// @route  GET /api/owners/profile
const getOwnerProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerOwner, loginOwner, getOwnerProfile };
