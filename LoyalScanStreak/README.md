# 🔥 LoyalScanStreak

A digital loyalty-card system for local shops. Every customer gets a unique
QR code instead of a physical card — the shop owner scans it, verifies the
bill, and taps **Update Loyalty**. No cards to lose, no billing/POS
complexity, just a simple points-and-rewards loop.

> Full planning doc (architecture, DB design, milestone breakdown) is in
> [`PLANNING.md`](./PLANNING.md).

---

## 🆕 v2 additions (restaurant theme + calendar-day loyalty)

- **1 point per calendar day** (not a 24h rolling window) — enforced on the backend
- Skipped days never reset progress — it's a **10-Visit Loyalty Journey**, not a streak
- Persistent **notification center** (🔔 in navbar) for both Customer and Owner portals
- Custom success **toast** after a loyalty update (no more browser `alert()`)
- Big **completion celebration modal** + a 24-hour **achievement banner** at 10/10
- Big **daily success banner** the moment a point is recorded, visible on every page load for the rest of that calendar day
- Subtle, original SVG background patterns - a different food/restaurant theme per page (fork & knife on Home, coffee cup on Login/Register, flame & sparkle on the Customer Dashboard, chef hat & receipt on the Owner side)
- Restaurant theme: Playfair Display + Poppins fonts, warm color palette, hover effects everywhere
- Centered, restyled login/register pages on all screen sizes

## ✨ Features

- Two roles: **Customer** and **Shop Owner**, with separate dashboards
- JWT authentication + bcrypt password hashing
- Every customer gets a unique Customer ID (`CUS####`) and a QR code
- Owner scans a QR (camera, in-browser) or types the ID manually
- One click ("Update Loyalty") adds 1 point after manual bill verification
- Points auto-reset once a reward is unlocked (10 points → 1 reward, easy to change)
- Full loyalty audit trail (`LoyaltyTransaction` collection)
- Role-based route protection on both frontend and backend

## 🧱 Tech stack

**Frontend:** React (Vite) · React Router · Axios · `qrcode.react` (generate) · `html5-qrcode` (scan)
**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcryptjs

## 📁 Project structure

```
LoyalScanStreak/
├── backend/     → Express API (models, routes, controllers, middleware)
└── frontend/    → React app (Vite)
```

---

## 🚀 Running it locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed
- MongoDB running — either locally (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/loyalscanstreak
JWT_SECRET=any_long_random_string
```

Then start it:
```bash
npm run dev
```
You should see `MongoDB connected...` and `Server running on port 5000`.

### 2. Frontend

Open a **second terminal**:
```bash
cd frontend
npm install
npm run dev
```
Vite will print a local URL — usually **http://localhost:5173**.

> The frontend is pre-configured to call the API at `http://localhost:5000/api`
> (see `frontend/src/services/api.js`). Change that if your backend runs elsewhere.

### 3. Try it out

1. Open the frontend URL → **Register as a Customer** → note your Customer ID + QR code.
2. Open an incognito window → **Register as a Shop Owner**.
3. On the Owner Dashboard, click **Scan Customer QR** and either scan the QR
   from the first window/phone, or type the Customer ID manually.
4. Click **Update Loyalty** → switch back to the customer tab and refresh —
   points go up.

---

## 🔌 API reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/customers/register` | Public | Register a customer |
| POST | `/api/customers/login` | Public | Customer login |
| GET | `/api/customers/profile` | Customer | Own profile + points |
| GET | `/api/customers?search=` | Owner | List/search customers |
| GET | `/api/customers/lookup/:customerId` | Owner | Look up one customer (QR result) |
| POST | `/api/owners/register` | Public | Register a shop owner |
| POST | `/api/owners/login` | Public | Owner login |
| GET | `/api/owners/profile` | Owner | Own profile |
| POST | `/api/loyalty/update` | Owner | Add 1 point to a customer (`409` if already recorded today) |
| GET | `/api/loyalty/history/:customerId` | Owner | Loyalty transaction history |
| GET | `/api/notifications` | Customer/Owner | Own notifications, newest first |
| PATCH | `/api/notifications/read-all` | Customer/Owner | Mark own notifications as read |

All protected routes require `Authorization: Bearer <token>`.

---

## 📤 Pushing this to GitHub

```bash
cd LoyalScanStreak
git init
git add .
git commit -m "Initial commit: LoyalScanStreak MVP"
git branch -M main
git remote add origin https://github.com/<your-username>/LoyalScanStreak.git
git push -u origin main
```

`node_modules/` and `.env` are already excluded via `.gitignore` — don't
remove that, or you'll accidentally commit your JWT secret and thousands of
dependency files.

---

## 🎤 Hackathon presentation tips

**Problem → Solution, in one line:** "Physical loyalty cards get lost,
forgotten, or damaged — so shops lose repeat customers. LoyalScanStreak
replaces the card with a QR code the customer already has on their phone."

**Suggested 3-minute demo flow:**
1. Show the Customer Dashboard — points, progress bar, QR code, rules (10 sec)
2. Switch to Owner Dashboard — customer list (10 sec)
3. Live scan the QR with a phone/webcam → customer found → Update Loyalty
   (this is the "wow" moment — rehearse it once beforehand so the camera
   permission popup doesn't surprise you on stage)
4. Flip back to the Customer Dashboard, refresh → points visibly went up
5. Mention what you deliberately left out (billing, payments, multi-shop)
   and why — shows scope discipline, which judges like

**Likely judge questions to prep for:**
- "Why QR and not just a login?" → No app to open, works even for a one-time visitor, scan is faster than typing
- "How do you stop a customer giving themselves points?" → Backend role middleware enforces Owner-only on the update route, not just a hidden button
- "What happens if the QR is lost/screenshotted and shared?" → Worth having an honest answer ready: currently it's trust-based like a shared card would be; a real next step would be short-lived signed tokens instead of a static ID
