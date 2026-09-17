# services/

All communication with the backend API lives here (using `fetch` or `axios`).

Example (later milestones): `authService.js` (login/register calls), `customerService.js`, `loyaltyService.js`.

Why separate this? So pages don't directly contain API URLs/fetch logic — if the backend URL changes, we only edit one place.
