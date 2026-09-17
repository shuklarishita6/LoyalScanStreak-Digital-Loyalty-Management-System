const mongoose = require('mongoose');

// One row per "Update Loyalty" click - acts as an audit trail behind
// Customer.loyaltyPoints, so points can always be traced back to who granted them and when.
const loyaltyTransactionSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopOwner', required: true },
    pointsAdded: { type: Number, default: 1 },
    pointsAfterUpdate: { type: Number, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopOwner', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
