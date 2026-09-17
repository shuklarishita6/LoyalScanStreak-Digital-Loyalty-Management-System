# routes/

Defines the API's URLs (endpoints) and which controller function handles each one. Routes do NOT contain business logic — they just map "URL + method" -> "function".

Example (later milestones):
POST /api/customer/register -> customerController.register
POST /api/customer/login    -> customerController.login
POST /api/loyalty/update    -> loyaltyController.updatePoints
