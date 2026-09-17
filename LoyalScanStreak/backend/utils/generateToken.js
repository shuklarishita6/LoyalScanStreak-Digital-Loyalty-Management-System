const jwt = require('jsonwebtoken');

// A JWT is a signed ticket: it proves "this user logged in successfully"
// without the server needing to keep a session in memory. We embed the
// user's DB id and their role (customer/owner) so middleware can check both.
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;
