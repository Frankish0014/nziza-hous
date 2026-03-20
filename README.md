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

- Frontend: Vercel
- Backend: Render or Railway
- PostgreSQL: Supabase or Neon

Recommended:
- Use managed Postgres pooling
- Enable HTTPS-only cookies/session hardening if moving to cookie auth
- Add CDN-backed object storage (S3-compatible) for images in production