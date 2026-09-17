# LoyalScanStreak — Project Plan

A digital loyalty system that replaces the physical loyalty card with a
unique Customer ID + QR code. Built as a B.Tech-level MERN project.

---

## 1. Is this project suitable for a beginner?

Yes — with the scope you've defined, this is a well-sized project. Reasons:

- **The core loop is small and concrete**: register → get QR → owner scans → owner
  clicks a button → a number goes up. That's one clear, explainable flow — good
  for a viva.
- **It naturally teaches the full MERN stack** without forcing you into anything
  exotic: CRUD, auth, roles, and one genuinely interesting twist (QR) that makes
  the project stand out from a generic to-do app.
- **You've already cut the scary parts** — no billing, no payments, no inventory.
  That was the right call; those are what make student projects balloon out of
  control.
- **Realistic risk area**: QR *scanning* (via a phone camera, in the browser) is
  usually the trickiest part technically — not conceptually hard, but the most
  likely to eat time on library/permissions issues. We'll treat it as its own
  milestone and keep a fallback (manual Customer ID entry) so the project still
  works end-to-end even if camera scanning is fiddly on your dev machine.

Overall: appropriately scoped, good learning coverage, one manageable risk area.

---

## 2. Simplified Architecture

```
                        ┌─────────────────────┐
                        │   React Frontend     │
                        │  (Customer + Owner    │
                        │      portals)         │
                        └──────────┬───────────┘
                                   │  HTTP requests (fetch/axios)
                                   │  + JWT in headers
                                   ▼
                        ┌─────────────────────┐
                        │  Express Backend API  │
                        │  routes → middleware  │
                        │      → controllers    │
                        └──────────┬───────────┘
                                   │  Mongoose queries
                                   ▼
                        ┌─────────────────────┐
                        │      MongoDB          │
                        │  Customers            │
                        │  ShopOwners            │
                        │  LoyaltyTransactions   │
                        └─────────────────────┘
```

Two frontend "portals" (Customer, Owner) → one backend API → one database.
No microservices, no separate services per role — just role-based access
control inside a single Express app.

---

## 3. Final Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React.js + React Router | Standard, huge community, easy to explain in viva |
| Styling | Plain CSS (or CSS modules) | No need for a CSS framework to learn on top of everything else |
| Backend | Node.js + Express.js | Pairs naturally with React (MERN), simple routing model |
| Database | MongoDB + Mongoose | Flexible schema, beginner-friendly, no SQL joins to manage |
| Auth | JWT + bcrypt/bcryptjs | Industry-standard, small to implement, good viva talking point |
| QR Generate | `qrcode.react` (or `qrcode` npm package) | Simple, well-documented React QR generator |
| QR Scan | `html5-qrcode` (or `react-qr-reader`) | Uses the phone/laptop camera in-browser, no native app needed |

---

## 4. Database Design

Three collections, related by simple string/ObjectId references (no complex joins needed).

### Customer
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Mongo default |
| `customerId` | String, unique | e.g. `CUS1001` — this is what goes inside the QR |
| `name` | String | |
| `email` | String, unique | |
| `phone` | String | |
| `passwordHash` | String | never store plain password |
| `role` | String | always `"customer"` |
| `loyaltyPoints` | Number, default 0 | |
| `createdAt` | Date | |

### ShopOwner
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `shopId` | String, unique | for future multi-shop support |
| `shopName` | String | |
| `ownerName` | String | |
| `email` | String, unique | |
| `passwordHash` | String | |
| `role` | String | always `"owner"` |
| `createdAt` | Date | |

### LoyaltyTransaction
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `customerId` | ObjectId (ref → Customer) | who earned the point |
| `shopId` | ObjectId (ref → ShopOwner) | who granted it |
| `pointsAdded` | Number | usually `1` |
| `pointsAfterUpdate` | Number | snapshot for easy history display |
| `updatedBy` | ObjectId (ref → ShopOwner) | audit trail |
| `createdAt` | Date | |

**Relationship:** one Customer → many LoyaltyTransactions. One ShopOwner → many
LoyaltyTransactions. `Customer.loyaltyPoints` is the fast-read running total;
`LoyaltyTransaction` is the audit log behind it (so points can never be
increased without a matching, traceable record).

---

## 5. Milestone Roadmap

| # | Milestone |
|---|---|
| 1 | Project planning + folder structure ✅ *(this response)* |
| 2 | React frontend setup |
| 3 | Node.js + Express backend setup |
| 4 | MongoDB connection |
| 5 | Customer registration |
| 6 | Shop Owner registration |
| 7 | Login + JWT authentication |
| 8 | Role-based authorization |
| 9 | Customer dashboard |
| 10 | Generate unique Customer ID + QR |
| 11 | Owner dashboard + registered customer list |
| 12 | QR scanning |
| 13 | Show customer info after QR scan |
| 14 | Owner manually verifies physical bill |
| 15 | Owner updates loyalty points |
| 16 | Store loyalty history |
| 17 | Customer sees updated points |
| 18 | Reward progress + rules section |
| 19 | Responsive UI + final improvements |
| 20 | Testing + bug fixing |
| 21 | Final documentation + viva prep |

We'll do these one at a time — I'll wait for you after each one.

---

## 6. Folder Structure

```
LoyalScanStreak/
├── frontend/
│   └── src/
│       ├── components/   → reusable small UI pieces (Navbar, ProgressBar, QR display...)
│       ├── pages/         → full screens / routes (Login, Dashboard...)
│       ├── services/      → all API calls to the backend live here
│       ├── context/       → global state (who's logged in — AuthContext)
│       ├── App.jsx        → added in Milestone 2
│       └── main.jsx       → added in Milestone 2
│
└── backend/
    ├── models/       → Mongoose schemas (Customer, ShopOwner, LoyaltyTransaction)
    ├── routes/       → API URL definitions (maps a URL to a controller function)
    ├── controllers/  → the actual logic behind each route
    ├── middleware/   → checkpoints between request and controller (auth check, role check)
    ├── config/       → setup code (MongoDB connection)
    └── server.js     → added in Milestone 3
```

Each folder above already has its own `README.md` inside it explaining its
purpose — take a look as you explore the zip.
