// Checkpoint #2: "Is this user ALLOWED to do this specific thing?"
// Runs after `protect`, which already put req.userRole on the request.

const ownerOnly = (req, res, next) => {
  if (req.userRole !== 'owner') {
    return res.status(403).json({ message: 'Access denied: Shop Owner only' });
  }
  next();
};

const customerOnly = (req, res, next) => {
  if (req.userRole !== 'customer') {
    return res.status(403).json({ message: 'Access denied: Customer only' });
  }
  next();
};

module.exports = { ownerOnly, customerOnly };
