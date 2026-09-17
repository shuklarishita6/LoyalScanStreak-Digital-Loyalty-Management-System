const Customer = require('../models/Customer');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const Notification = require('../models/Notification');
const { isSameCalendarDay } = require('../utils/dateHelpers');

// Change this ONE number to change how many points unlock a reward.
const REWARD_THRESHOLD = 10;

// @desc   Owner adds 1 loyalty point after manually verifying the physical bill.
//         Enforces: max 1 point per customer per CALENDAR DAY (not a 24h rolling window).
//         Missed days never reset progress - this is a "10-visit journey," not a streak.
// @route  POST /api/loyalty/update
// @body   { customerId }
const updateLoyalty = async (req, res) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ message: 'customerId is required' });
    }

    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // RULE: only one point per calendar day. Enforced here on the backend -
    // the frontend button also disables itself, but this check is the real gate.
    if (isSameCalendarDay(customer.lastLoyaltyUpdatedAt, new Date())) {
      return res.status(409).json({
        message: "Today's loyalty has already been recorded!",
        alreadyRecordedToday: true,
        customerId: customer.customerId,
        name: customer.name,
        loyaltyPoints: customer.loyaltyPoints,
      });
    }

    const now = new Date();
    customer.loyaltyPoints += 1;
    customer.lastLoyaltyUpdatedAt = now;

    let rewardUnlocked = false;
    if (customer.loyaltyPoints >= REWARD_THRESHOLD) {
      rewardUnlocked = true;
      customer.loyaltyCompletedAt = now; // stamped BEFORE reset, so the 24h banner/notification can reference it
      customer.loyaltyPoints = 0; // reset for the next 10-visit journey
    }

    await customer.save();

    // Existing audit trail - unchanged.
    await LoyaltyTransaction.create({
      customer: customer._id,
      shop: req.user._id,
      pointsAdded: 1,
      pointsAfterUpdate: customer.loyaltyPoints,
      updatedBy: req.user._id,
    });

    // Notifications for BOTH portals - the shop name is pulled live from the
    // logged-in owner, so it's never hardcoded.
    if (rewardUnlocked) {
      await Notification.create({
        recipientRole: 'customer',
        recipientId: customer._id,
        type: 'loyalty_completed',
        title: `Congratulations, ${customer.name}! You completed your 10-Visit Loyalty Journey! 🎉`,
        message: `Thanks for visiting "${req.user.shopName}"! We have something special waiting for you. ❤️`,
      });
      await Notification.create({
        recipientRole: 'owner',
        recipientId: req.user._id,
        type: 'loyalty_completed',
        title: 'Loyalty Journey Completed! 🎉',
        message: `${customer.name} has completed their 10-Visit Loyalty Journey. Reward available! 🎁`,
      });
    } else {
      await Notification.create({
        recipientRole: 'customer',
        recipientId: customer._id,
        type: 'loyalty_update',
        title: "Today's Loyalty Updated!",
        message: `Your loyalty point has been successfully recorded. 🔥 ${customer.loyaltyPoints} / ${REWARD_THRESHOLD}`,
      });
      await Notification.create({
        recipientRole: 'owner',
        recipientId: req.user._id,
        type: 'loyalty_update',
        title: 'Loyalty Updated',
        message: `${customer.name}'s loyalty has been updated successfully. 🔥 ${customer.loyaltyPoints} / ${REWARD_THRESHOLD}`,
      });
    }

    res.json({
      message: rewardUnlocked ? 'Reward unlocked! Points reset for the next journey.' : 'Loyalty updated successfully',
      customerId: customer.customerId,
      name: customer.name,
      loyaltyPoints: customer.loyaltyPoints,
      rewardUnlocked,
      rewardThreshold: REWARD_THRESHOLD,
      loyaltyCompletedAt: customer.loyaltyCompletedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get the loyalty transaction history for one customer
// @route  GET /api/loyalty/history/:customerId
// (unchanged)
const getLoyaltyHistory = async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const history = await LoyaltyTransaction.find({ customer: customer._id })
      .populate('updatedBy', 'shopName')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateLoyalty, getLoyaltyHistory, REWARD_THRESHOLD };


