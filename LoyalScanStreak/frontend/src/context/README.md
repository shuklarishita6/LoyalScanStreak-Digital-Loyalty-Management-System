# context/

React Context for global state — mainly "who is logged in right now" (the user + their role + their JWT token).

Example (later milestones): `AuthContext.jsx`.

Why needed? Login state is needed in many components (Navbar, Dashboard, protected routes) — Context avoids passing it down manually through every component ("prop drilling").
