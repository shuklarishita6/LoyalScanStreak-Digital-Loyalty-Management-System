# middleware/

Functions that run BETWEEN the incoming request and the controller — like a checkpoint.

Example (later milestones): `authMiddleware.js` (checks the JWT token is valid), `roleMiddleware.js` (checks the user is a Shop Owner before allowing "update loyalty").

Analogy: middleware is a security guard who checks your ID card before letting you into a specific room (route).
