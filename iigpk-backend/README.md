# IIGPK Backend — Certificates API + Admin Portal

Express + MongoDB (Mongoose), following the same pattern you provided
(Category CRUD), applied to a `Certificate` model with `number` and
`imgUrl`. Admin login uses a dedicated `Admin` table (`adminId` + a
bcrypt-hashed password) and JWT sessions — no third-party auth provider.

## Endpoints

| Method | Path                              | Access        | Purpose                              |
|--------|-----------------------------------|---------------|---------------------------------------|
| POST   | `/api/admin/login`                | Public        | Admin logs in, gets a JWT             |
| GET    | `/api/certificates/search/:number`| Public        | Used by the frontend search bar       |
| GET    | `/api/certificates`               | Admin only    | List all certificates (admin table)   |
| GET    | `/api/certificates/:id`           | Admin only    | Get one certificate (edit form)       |
| POST   | `/api/certificates`               | Admin only    | Create a certificate                  |
| PUT    | `/api/certificates/:id`           | Admin only    | Update a certificate                  |
| DELETE | `/api/certificates/:id`           | Admin only    | Delete a certificate                  |

Admin routes expect `Authorization: Bearer <JWT from /api/admin/login>`.

## Creating an admin

There's no public signup — admins are created directly from the command
line:
```bash
node scripts/createAdmin.js owner@iigpk.com "a-strong-password"
```
This hashes the password with **bcrypt** (12 salt rounds) before storing
it; the plaintext password is never written to MongoDB. Run the same
command again with a new password to reset it.

## How login works

1. `POST /api/admin/login` with `{ adminId, password }`.
2. The server looks up the `Admin` by `adminId`, compares the password
   against the stored bcrypt hash with `bcrypt.compare`, and — if it
   matches — signs a JWT (`utils/jwt.js`) containing the admin's id and
   role, valid for 7 days.
3. The frontend stores that JWT and sends it as
   `Authorization: Bearer <token>` on every admin request.
4. `middleware/auth.js` verifies the JWT and re-checks the admin still
   exists before allowing access to any CRUD route.

## Setup

1. `cp .env.example .env` and fill in:
   - `MONGO_URI` — your MongoDB connection string
   - `JWT_SECRET` — generate with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
     ```
2. Install and run:
   ```bash
   npm install
   npm run dev   # or: npm start
   ```
3. Create your first admin:
   ```bash
   npm run create-admin -- owner@iigpk.com "a-strong-password"
   ```

## Connecting the frontend

- Public search bar → `GET {API_URL}/api/certificates/search/:number`
- Admin login → `POST {API_URL}/api/admin/login` with `{ adminId, password }`
- Admin CRUD → the 5 protected endpoints above, with the JWT from login in
  the `Authorization` header
