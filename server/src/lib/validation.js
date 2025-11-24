import { z } from "zod";

export const allowedTypes = ["tiny_house", "cabin", "van", "studio"];
export const allowedZones = ["sleep", "work", "dining", "kitchen", "entry", "pet", "storage"];
export const allowedOccupants = ["solo", "couple", "family"];
export const allowedMobility = ["mobile", "fixed"];

export const profileSchema = z.object({
  length: z.coerce.number().positive().max(100),
  width: z.coerce.number().positive().max(100),
  height: z.coerce.number().positive().max(10),
  type: z.enum(allowedTypes),
  occupants: z.enum(allowedOccupants),
  zones: z.array(z.enum(allowedZones)).min(1),
  mobility: z.enum(allowedMobility).optional(),
  loft: z.boolean().optional(),
});

export const favoritesSchema = z.object({
  favorites: z
    .array(
      z.object({
        type: z.enum(["layout", "furniture"]),
        id: z.string().trim().min(1),
      })
    )
    .max(200),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(["user", "admin"]).optional(),
  adminInviteCode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const preferencesSchema = z.object({
  userType: z.enum(["planning", "already_living", "just_curious"]),
  spaceType: z.enum(allowedTypes),
  occupants: z.enum(allowedOccupants),
  hasPets: z.boolean(),
});
