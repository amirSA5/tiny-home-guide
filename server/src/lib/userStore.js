import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "./db.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

function normalizeEmail(email) {
  return email?.trim().toLowerCase();
}

export function toPublicUser(user) {
  if (!user) return null;
  const obj = typeof user.toObject === "function" ? user.toObject() : user;
  const id = obj._id ? obj._id.toString() : obj.id;
  return {
    id,
    email: obj.email,
    role: obj.role,
    createdAt:
      obj.createdAt instanceof Date
        ? obj.createdAt.toISOString()
        : obj.createdAt,
  };
}

async function ensureModel() {
  await connectDb();
  return User;
}

export async function listUsers() {
  const Model = await ensureModel();
  const users = await Model.find().sort({ createdAt: 1 }).lean();
  return users.map(toPublicUser);
}

export async function getUserById(id) {
  if (!id) return null;
  const Model = await ensureModel();
  const user = await Model.findById(id).lean();
  return user;
}

export async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;
  const Model = await ensureModel();
  return Model.findOne({ email: normalizedEmail }).lean();
}

export async function anyAdminExists() {
  const Model = await ensureModel();
  const existing = await Model.exists({ role: "admin" });
  return !!existing;
}

export async function createUser({ email, password, role = "user" }) {
  const Model = await ensureModel();
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  const existing = await Model.findOne({ email: normalizedEmail }).lean();
  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await Model.create({
    email: normalizedEmail,
    role,
    passwordHash,
  });
  return user.toObject();
}

export async function validateCredentials(email, password) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;
  const Model = await ensureModel();
  const user = await Model.findOne({ email: normalizedEmail }).lean();
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function ensureAdminFromEnv() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return null;

  const existing = await findUserByEmail(adminEmail);
  if (existing) return existing;

  const admin = await createUser({
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  return admin;
}
