# Tiny Home Living Guide

Tiny Home Living Guide helps you turn small spaces into smart, comfortable homes. Tell the app your dimensions, how many people live there, and what zones you need (sleep, work, dining, storage, pet corner). The app recommends layout patterns, multifunctional furniture, design tips, and lets you save favorites. The API returns tailored suggestions and stores favorites by client id.

## Features

- Space profile with dimensions, type, occupants, and zones
- Server-backed recommendations for layouts, furniture, and design tips (with offline fallback on the client)
- Save favorites; synced to the API and cached locally
- Simple, single-page navigation (React Router)

## Stack

- Frontend: React + Vite, React Router 7
- Backend: Express, Zod validation

## Running locally

### Backend API
```bash
cd server
npm install
npm run dev   # http://localhost:4000
```

### Frontend
```bash
cd tiny-home-guide
npm install
npm run dev   # http://localhost:5173
```

Environment variables:
- `VITE_API_URL` (frontend) – API base URL, defaults to `http://localhost:4000`.
- `PORT` (backend) – API port, defaults to `4000`.

Favorites persistence lives in `server/data/favorites-store.json`. Remove the file to reset saved favorites. The frontend also caches space profile and favorites in `localStorage` for quick reloads.
