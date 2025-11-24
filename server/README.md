# Tiny Home Guide API

Simple Express API that powers the Tiny Home Living Guide frontend. It returns tailored layout and furniture recommendations and stores favorites per client.

## Quick start

```bash
cd server
npm install
npm run dev   # starts on http://localhost:4000 with file watching
```

The API now persists users with MongoDB + Mongoose. Set `MONGODB_URI` or make sure a local MongoDB is running on `mongodb://localhost:27017/tiny-home-guide`.

## Environment

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `4000` | API port |
| `MONGODB_URI` | `mongodb://localhost:27017/tiny-home-guide` | MongoDB connection string for users and auth. |
| `JWT_SECRET` | `dev-secret-change-me` | Secret for signing auth tokens. |
| `ADMIN_EMAIL` | _unset_ | When set with `ADMIN_PASSWORD`, seeds an admin user at startup. |
| `ADMIN_PASSWORD` | _unset_ | Password for the seeded admin. |
| `ADMIN_INVITE_CODE` | _unset_ | Optional code required when registering admins via API. |
| `CORS_ORIGIN` | `*` | Not required because CORS is open by default. |

## Endpoints

- `GET /health` - status and count of clients with saved favorites.
- `POST /api/recommendations` - body: `{ length, width, type, occupants, zones[] }`. Returns layouts, furniture, and tips.
- `GET /api/favorites/:clientId` - fetch favorites for a client id.
- `PUT /api/favorites/:clientId` - body: `{ favorites: [{ type: "layout"|"furniture", id }] }`. Saves favorites and persists to `data/favorites-store.json`.
- `POST /auth/register` - body: `{ email, password, role?, adminInviteCode? }`. Returns `{ user, token }`. Admin role requires invite or no existing admin.
- `POST /auth/login` - body: `{ email, password }`. Returns `{ user, token }`.
- `GET /auth/me` - bearer token required. Returns current user.
- `GET /admin/users` - bearer token + admin role required. Lists users (without password hashes).
- `GET /api/preferences` - bearer token required. Returns `{ preferences }` for the current user (onboarding).
- `PUT /api/preferences` - bearer token required. Body: `{ userType, spaceType, occupants, hasPets }`. Upserts onboarding preferences.

Users and auth metadata live in MongoDB. Favorites are still stored in `server/data/favorites-store.json`; delete the file to reset favorites.
