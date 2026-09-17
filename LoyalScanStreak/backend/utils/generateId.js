const Customer = require('../models/Customer');
const ShopOwner = require('../models/ShopOwner');

// Keeps generating a random ID until it finds one that isn't already taken.
// Simple and beginner-friendly; fine for a project of this scale.
const generateCustomerId = async () => {
  let customerId;
  let exists = true;
  while (exists) {
    const random = Math.floor(1000 + Math.random() * 9000);
    customerId = `CUS${random}`;
    exists = await Customer.findOne({ customerId });
  }
  return customerId;
};

const generateShopId = async () => {
  let shopId;
  let exists = true;
  while (exists) {
    const random = Math.floor(1000 + Math.random() * 9000);
    shopId = `SHOP${random}`;
    exists = await ShopOwner.findOne({ shopId });
  }
  return shopId;
};

module.exports = { generateCustomerId, generateShopId };
