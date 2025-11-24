import jwt from "jsonwebtoken";
import {
  getUserById,
  toPublicUser,
} from "./userStore.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

export function issueToken(user) {
  const userId = user?.id || user?._id?.toString();
  if (!userId) {
    throw new Error("User missing id");
  }
  return jwt.sign(
    {
      sub: userId,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function decodeToken(token) {
  const payload = jwt.verify(token, JWT_SECRET);
  const user = await getUserById(payload.sub);
  if (!user) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }
  return toPublicUser(user);
}

export async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }
    const user = await decodeToken(token);
    req.user = user;
    return next();
  } catch (err) {
    const status = err.status || 401;
    return res.status(status).json({ error: "Unauthorized" });
  }
}

export function adminRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  return next();
}

export { toPublicUser };
