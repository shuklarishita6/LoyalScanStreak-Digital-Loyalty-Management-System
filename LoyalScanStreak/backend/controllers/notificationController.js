const Notification = require('../models/Notification');

// @desc   Get the logged-in user's (customer OR owner) notifications, newest first.
//         Works for both roles because `protect` already tells us req.userRole
//         and req.user._id - we just filter by whichever one is logged in.
// @route  GET /api/notifications
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientRole: req.userRole,
      recipientId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Mark all of the logged-in user's notifications as read
// @route  PATCH /api/notifications/read-all
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientRole: req.userRole, recipientId: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyNotifications, markAllRead };
