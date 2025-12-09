# Authentication-App

**Overview:**
 Full-stack example app demonstrating a simple email/password authentication flow using:
   Backend: Node.js + Express, MySQL (`mysql2`), bcrypt, jsonwebtoken (JWT), cookie-parser, CORS
   Frontend: React (Vite), Axios, React Router, Bootstrap
  Flow: User registers → hashed password saved in DB → user logs in → server issues JWT in a cookie → frontend verifies JWT via an auth-check endpoint and displays protected UI.

**Repository layout**
  `backend/` — Express API server (`server.js`) and `package.json` (server dependencies)
 `frontend/my-react-app/` — React app (Vite) with `src/` components (Register, Login, Home, App, etc.)

**Prerequisites**
 Node.js (v16+ recommended)
 npm
 MySQL server running locally (or remote) with credentials accessible to `backend/server.js`

**Database setup**
   Connect to your MySQL server and create the database and table used by this project (example SQL):

```sql
CREATE DATABASE IF NOT EXISTS signup;
USE signup;

CREATE TABLE IF NOT EXISTS login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

1. Update DB credentials in `backend/server.js` if needed (host, user, password, database).

**Backend – install & run**
 Open a terminal and navigate to the backend folder:

```powershell
cd 'C:\Users\HP\OneDrive\文档\Authentication app\backend'

   Install dependencies (if not already installed):

```powershell
npm install
```

 Start the backend server:

```powershell
node server.js
```

- Default port used by `server.js` is `5000`. You should see a console message like `Server running on port 5000` and `Connected to MySQL database`.

**Frontend – install & run**
 Open a separate terminal and navigate to the frontend app:

```powershell
cd 'C:\Users\HP\OneDrive\文档\Authentication app\frontend\my-react-app'
```

 Install dependencies:

```powershell
npm install
```

 Start the Vite dev server (force port 5173 to match backend CORS config):

```powershell
npm run dev -- --port 5173
```

- Open the printed local URL (e.g. `http://localhost:5173`). If Vite switches to a different port (e.g. 5174), either restart with `--port 5173` or add that port to backend CORS origins.

**API endpoints (backend)**
 `POST /register` — register a new user
  Body: `{ name, email, password }`
  Response: `{ Status: 'User Registered Successfully' }` or `{ Error: '...' }`

- `POST /login` — login and set JWT cookie
  - Body: `{ email, password }`
  - On success sets a cookie named `token` and returns `{ Status: 'Login Successful' }`

- `GET /` — auth-check (protected)
  - Reads JWT from cookie `token`. On success returns `{ Status: 'Success', name }`.

- `GET /logout` — clears the `token` cookie and returns `{ Status: 'Logged out' }`.

**How the auth flow works (front → back)**
 Frontend sends `POST /register` and `POST /login` using Axios.
  Axios must send credentials (cookies) for cross-origin requests. Ensure requests include `{ withCredentials: true }`.
  Backend must set CORS with `credentials: true` and allow the frontend origin.
  For cookies to be set cross-site in modern browsers, cookie options matter (`SameSite`, `Secure`). During local development you may need to relax `secure`/`sameSite` settings.

**Common troubleshooting**
  Blank page or React runtime errors: check browser console for errors and fix typos (e.g. `useNavigate` import, component names). The frontend app must compile without errors.
  `Unknown database 'signup'`: create the `signup` database and `login` table as shown above or change `backend/server.js` to point to your DB.
 Cookie not being set after login:
   Ensure `axios` call uses `withCredentials: true`.
   Backend must use `app.use(cors({ origin: 'http://localhost:5173', credentials: true }))` (or include the actual Vite origin).
   For cross-site cookie setting, browsers require `SameSite=None` and `Secure`. During local dev, `secure: false` + `sameSite: 'lax'` may be necessary.
   Inspect DevTools → Network for the `Set-Cookie` header on the login response and DevTools → Application → Cookies to see if `token` is present.
 GET `/` returns not authenticated: cookie is missing, expired, or invalid. Check the login response `Set-Cookie`, backend logs, and verify JWT secret matches between signing and verifying.

**Security notes**
 The example uses a hard-coded JWT secret (`jwt-secret-key`) and simple cookie options for development. For production:
   Use strong, environment-based secrets (e.g. `process.env.JWT_SECRET`).
   Serve over HTTPS and set `secure: true` on cookies.
   Use proper CORS restrictions and CSRF protections as needed.

**Suggested next improvements**
  Move secrets and DB credentials to environment variables and load via `dotenv`.
 Add input validation on the backend (e.g. email format, password strength).
  Implement refresh tokens (longer-lived session + short-lived access tokens) for improved security.
 Use a Vite proxy in `vite.config.js` to avoid cross-origin cookie issues in development (proxy `/api` → `http://localhost:5000`).

**Where to look for logs & errors**
 Backend: terminal where `node server.js` runs — server logs and DB errors printed here.
 Frontend: browser DevTools Console and Network tabs; Vite dev server output in its terminal.

**Contact / help**
If you want, I can:

- Convert `backend/server.js` to read credentials from `.env` and add a `.env.example` file.
- Add a `vite.config.js` proxy so frontend and backend share origin during dev.
- Add unit/integration tests for auth endpoints.

---
README generated by assistant. If you want different formatting (shorter/longer), or want me to also update `frontend/my-react-app/README.md`, tell me which files to modify next.