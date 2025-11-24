# Tiny Home Guide API

Simple Express API that powers the Tiny Home Living Guide frontend. It returns tailored layout and furniture recommendations and stores favorites per client.

## Quick start

```bash
cd server
npm install
npm run dev   # starts on http://localhost:4000 with file watching
```

## Environment

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `4000` | API port |
| `CORS_ORIGIN` | `*` | Not required because CORS is open by default. |

## Endpoints

- `GET /health` - status and count of clients with saved favorites.
- `POST /api/recommendations` - body: `{ length, width, type, occupants, zones[] }`. Returns layouts, furniture, and tips.
- `GET /api/favorites/:clientId` - fetch favorites for a client id.
- `PUT /api/favorites/:clientId` - body: `{ favorites: [{ type: "layout"|"furniture", id }] }`. Saves favorites and persists to `data/favorites-store.json`.

Favorites are stored in `server/data/favorites-store.json`. Delete the file to reset.
