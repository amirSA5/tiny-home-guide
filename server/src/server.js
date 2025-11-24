import cors from "cors";
import express from "express";
import {
  getFavorites,
  getSnapshot,
  setFavorites,
} from "./lib/favoritesStore.js";
import { buildRecommendations } from "./lib/recommendations.js";
import {
  favoritesSchema,
  loginSchema,
  profileSchema,
  registerSchema,
} from "./lib/validation.js";
import {
  adminRequired,
  authRequired,
  issueToken,
  toPublicUser,
} from "./lib/auth.js";
import { connectDb } from "./lib/db.js";
import {
  anyAdminExists,
  createUser,
  ensureAdminFromEnv,
  listUsers,
  validateCredentials,
} from "./lib/userStore.js";
import dotenv from "dotenv";
dotenv.config();

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

app.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid registration payload",
      details: parsed.error.flatten(),
    });
  }

  const { email, password, role = "user", adminInviteCode } = parsed.data;

  if (role === "admin") {
    const invite = process.env.ADMIN_INVITE_CODE;
    const hasAdmin = await anyAdminExists();
    const inviteOk = invite && adminInviteCode === invite;
    if (!inviteOk && hasAdmin) {
      return res
        .status(403)
        .json({ error: "Admin invite code required to create admin users" });
    }
  }

  try {
    const user = await createUser({ email, password, role });
    const token = issueToken(user);
    return res.json({ user: toPublicUser(user), token });
  } catch (err) {
    if (err.message === "User already exists") {
      return res.status(409).json({ error: "User already exists" });
    }
    return res.status(500).json({ error: "Could not register user" });
  }
});

app.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid login payload",
      details: parsed.error.flatten(),
    });
  }

  const { email, password } = parsed.data;
  const user = await validateCredentials(email, password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = issueToken(user);
  return res.json({ user: toPublicUser(user), token });
});

app.get("/auth/me", authRequired, async (req, res) => {
  return res.json({ user: req.user });
});

app.get("/admin/users", authRequired, adminRequired, async (req, res) => {
  const users = await listUsers();
  return res.json({ users });
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

try {
  await connectDb();
  // Seed an admin user if ADMIN_EMAIL and ADMIN_PASSWORD are provided
  await ensureAdminFromEnv();

  app.listen(PORT, () => {
    console.log(`Tiny Home Guide API listening on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("Failed to start server", err);
  process.exit(1);
}
