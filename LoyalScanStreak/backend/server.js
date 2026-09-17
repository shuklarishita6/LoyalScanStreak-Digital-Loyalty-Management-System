require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const customerRoutes = require('./routes/customerRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LoyalScanStreak API is running...');
});

app.use('/api/customers', customerRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
