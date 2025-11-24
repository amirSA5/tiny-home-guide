import mongoose from "mongoose";
import { connectDb } from "./db.js";

const preferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    userType: {
      type: String,
      enum: ["planning", "already_living", "just_curious"],
      required: true,
    },
    spaceType: {
      type: String,
      enum: ["tiny_house", "cabin", "van", "studio"],
      required: true,
    },
    occupants: {
      type: String,
      enum: ["solo", "couple", "family"],
      required: true,
    },
    hasPets: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Preferences =
  mongoose.models.Preferences ||
  mongoose.model("Preferences", preferencesSchema);

async function ensureModel() {
  await connectDb();
  return Preferences;
}

function toPublic(pref) {
  if (!pref) return null;
  const obj = typeof pref.toObject === "function" ? pref.toObject() : pref;
  return {
    id: obj._id?.toString(),
    userId: obj.userId?.toString(),
    userType: obj.userType,
    spaceType: obj.spaceType,
    occupants: obj.occupants,
    hasPets: !!obj.hasPets,
    updatedAt:
      obj.updatedAt instanceof Date
        ? obj.updatedAt.toISOString()
        : obj.updatedAt,
    createdAt:
      obj.createdAt instanceof Date
        ? obj.createdAt.toISOString()
        : obj.createdAt,
  };
}

export async function getPreferencesForUser(userId) {
  if (!userId) return null;
  const Model = await ensureModel();
  const pref = await Model.findOne({ userId }).lean();
  return toPublic(pref);
}

export async function upsertPreferences(userId, payload) {
  if (!userId) {
    throw new Error("User id is required");
  }
  const Model = await ensureModel();
  const pref = await Model.findOneAndUpdate(
    { userId },
    { ...payload, userId },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return toPublic(pref);
}
