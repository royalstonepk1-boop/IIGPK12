# IIGPK — Certificate Verification Frontend

React + Vite + Tailwind CSS frontend with three pages: Home, About Us, Contact.

## What's inside

- **Home** — logo, hero, embedded YouTube video, and a certificate-number
  search box that calls your backend and displays the matching image.
- **About Us** — original placeholder copy (edit `src/pages/About.jsx`).
- **Contact** — placeholder address/phone/email + a contact form
  (edit `src/pages/Contact.jsx`).

## Connecting to your backend

Only one file matters: **`src/services/api.js`**.

1. Copy `.env.example` to `.env` (already done) and set your backend URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```
2. Public search calls:
   ```
   GET {VITE_API_BASE_URL}/api/certificates/search/:number
   -> { number, imgUrl }
   ```

## Admin portal

- `/admin/login` — sign in with an Admin ID + password (checked against a
  bcrypt hash on the backend). On success the backend returns a JWT,
  which is stored in `localStorage` and sent as
  `Authorization: Bearer <token>` on every admin request.
- `/admin` — protected dashboard with a table of certificates and an
  add/edit/delete form (`src/pages/AdminDashboard.jsx`,
  `src/services/adminApi.js`).

There's no signup screen — admins are created directly on the backend
with `npm run create-admin -- <adminId> <password>` (see the backend
README).

Your Mongoose schema should look like:
```js
const certificateSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  imgUrl: { type: String, required: true },
});
```

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```
Output goes to `dist/`.
