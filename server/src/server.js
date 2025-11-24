import cors from "cors";
import express from "express";
import { getFavorites, getSnapshot, setFavorites } from "./lib/favoritesStore.js";
import { buildRecommendations } from "./lib/recommendations.js";
import { favoritesSchema, profileSchema } from "./lib/validation.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", async (req, res) => {
  const snapshot = await getSnapshot();
  res.json({
    ok: true,
    uptimeSeconds: Math.round(process.uptime()),
    favoritesClients: Object.keys(snapshot.clients || {}).length,
  });
});

app.post("/api/recommendations", (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid space profile",
      details: parsed.error.flatten(),
    });
  }

  const recommendations = buildRecommendations(parsed.data);
  return res.json(recommendations);
});

app.get("/api/favorites/:clientId", async (req, res) => {
  const { clientId } = req.params;
  if (!clientId) {
    return res.status(400).json({ error: "Missing clientId" });
  }

  const favorites = await getFavorites(clientId);
  return res.json({ favorites });
});

app.put("/api/favorites/:clientId", async (req, res) => {
  const { clientId } = req.params;
  if (!clientId) {
    return res.status(400).json({ error: "Missing clientId" });
  }

  const parsed = favoritesSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid favorites payload",
      details: parsed.error.flatten(),
    });
  }

  const favorites = await setFavorites(clientId, parsed.data.favorites);
  return res.json({ favorites });
});

app.use((err, req, res, _next) => {
  console.error("Unexpected error", err);
  res.status(500).json({ error: "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`Tiny Home Guide API listening on http://localhost:${PORT}`);
});
