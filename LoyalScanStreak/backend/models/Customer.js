const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, unique: true }, // e.g. CUS4821 - this is what goes inside the QR code
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'customer' },
    loyaltyPoints: { type: Number, default: 0 },
    lastLoyaltyUpdatedAt: { type: Date, default: null }, // used to enforce "1 point per calendar day"
    loyaltyCompletedAt: { type: Date, default: null }, // when the customer last hit the reward threshold
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
