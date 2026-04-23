# Nziza House Platform

Production-style full-stack platform for lifestyle and hospitality services:
- Gym
- Apartments (short/long stay)
- Coffee Shop
- Sauna
- Massage
- Lodge

## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express.js (layered architecture)
- Database: PostgreSQL
- Auth: JWT + bcrypt password hashing
- Access Control: RBAC (visitor/customer/admin)

## Architecture

```text
Client -> API -> Middleware -> Controllers -> Services -> Repository -> PostgreSQL
```

Backend folders follow:

`/src/controllers`  
`/src/services`  
`/src/repositories`  
`/src/models`  
`/src/routes`  
`/src/middleware`  
`/src/config`  
`/src/utils`

Frontend folders follow:

`/src/components`  
`/src/pages`  
`/src/services`  
`/src/hooks`  
`/src/context`  
`/src/assets`

## Quick Start

### 1) Configure environment

Backend:

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in PostgreSQL credentials and JWT secret

Frontend:

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set `VITE_API_URL` (default points to local backend)

### 2) Run backend

```bash
cd backend
npm install
npm run dev
```

Server boot automatically:
- Initializes DB schema
- Seeds required roles (`customer`, `admin`)

### 3) Run frontend

```bash
cd frontend
npm install
npm run dev
```

## Main API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/services`
- `GET /api/services/:id`
- `POST /api/services` (admin)
- `PUT /api/services/:id` (admin)
- `DELETE /api/services/:id` (admin)
- `GET /api/bookings` (customer/admin role-dependent view)
- `POST /api/bookings` (customer)
- `PUT /api/bookings/:id` (admin status update)
- `POST /api/messages`
- `GET /api/messages` (admin)
- `POST /api/media/upload` (admin image upload)
- `POST /api/media` (admin attach media to service)
- `GET /api/media/service/:serviceId`
- `GET /api/admin/analytics` (admin)
- `GET /api/admin/users` (admin)

## Frontend Pages Implemented

- Home
- About
- Services listing
- Service details
- Booking page (with booking history)
- Contact page
- Authentication page (login/register)
- Admin dashboard (analytics, users, messages, bookings, service management, media attach/upload)

## Deployment

- Frontend: Netlify (see root `netlify.toml` and `scripts/netlify-prebuild.mjs`)
- Frontend (alternative): Vercel (`web` Next.js app)
- Backend: Render or Railway
- PostgreSQL: Supabase or Neon

### Vercel (Next.js in monorepo)

This repository includes a root `vercel.json` that forces Next.js deployment through workspace scripts.

Project settings in Vercel should be:

- Root Directory: repository root (do not switch to `backend` or `frontend`)
- Framework Preset: Next.js
- Build Command: leave empty (uses `vercel.json`) or `npm run build`
- Output Directory: leave empty (important)

If you previously set Output Directory to `public`, remove it and redeploy.

### Netlify + API (fix 404 on `/api/messages`, `/api/bookings/...`, auth, etc.)

The browser calls `/api/...` on your Netlify hostname. **POST** requests (contact form, register, proof upload) are **not** covered by a client-side router: if Netlify does not proxy `/api/*` to your Express app, you get **404** in production.

**Option A (recommended):** In Netlify → Site configuration → Environment variables, set **`NETLIFY_API_ORIGIN`** to your API **origin only**, for example `https://nziza-api.onrender.com` (no `/api` suffix, no trailing slash). Each build runs `scripts/netlify-prebuild.mjs`, which writes `frontend/public/_redirects` with `/api/*` → your backend **before** the `/* → /index.html` SPA rule. **Save the variable, then trigger a new deploy** (Clear cache and deploy if unsure).

**Option B:** Set **`VITE_API_URL`** at build time to your full public API base, e.g. `https://nziza-api.onrender.com/api` (must **not** be `localhost` — production builds ignore localhost). Rebuild.

**Do not** leave `VITE_API_URL=http://localhost:4000/api` on Netlify production: the app strips it and falls back to same-origin `/api`, which still needs Option A or a public Option B.

If the Netlify UI **overrides** the build command, either remove that override so `netlify.toml` `[build].command` runs, or set the command to:  
`node scripts/netlify-prebuild.mjs && npm --workspace frontend run build`

Backend **CORS**: if you use Option B (browser calls the API host directly), set `CORS_ORIGIN` on the API to include your Netlify site URL. Option A (proxy) keeps the browser on the Netlify origin for `/api`, so CORS is less of an issue for those routes.

Recommended:
- Use managed Postgres pooling
- Enable HTTPS-only cookies/session hardening if moving to cookie auth
- Add CDN-backed object storage (S3-compatible) for images in production