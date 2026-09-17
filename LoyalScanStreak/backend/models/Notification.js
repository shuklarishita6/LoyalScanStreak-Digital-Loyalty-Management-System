const mongoose = require('mongoose');

// One row per notification shown in either portal's notification center.
// This is its own collection (not just fields on Customer/ShopOwner)
// because each user can have MANY of these over time - it's a list,
// and it must survive refresh/reopen/login, so it lives in the database.
const notificationSchema = new mongoose.Schema(
  {
    recipientRole: { type: String, enum: ['customer', 'owner'], required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Customer._id or ShopOwner._id
    type: { type: String, enum: ['loyalty_update', 'loyalty_completed'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
