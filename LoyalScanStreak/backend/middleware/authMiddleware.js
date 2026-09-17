const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const ShopOwner = require('../models/ShopOwner');

// Checkpoint #1: "Is this a real, logged-in user?"
// Reads the JWT from the Authorization header, verifies it, and loads the
// matching Customer or ShopOwner onto req.user so later code can use it.
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === 'customer') {
        req.user = await Customer.findById(decoded.id).select('-passwordHash');
      } else if (decoded.role === 'owner') {
        req.user = await ShopOwner.findById(decoded.id).select('-passwordHash');
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.userRole = decoded.role;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
