const mongoose = require('mongoose');

const shopOwnerSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true, unique: true }, // e.g. SHOP1123
    shopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'owner' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShopOwner', shopOwnerSchema);
