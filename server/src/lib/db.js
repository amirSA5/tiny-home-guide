import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tiny-home-guide";

let connectionPromise = null;

export async function connectDb() {
  if (connectionPromise) {
    return connectionPromise;
  }

  mongoose.set("strictQuery", true);
  connectionPromise = mongoose
    .connect(MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    })
    .then((conn) => {
      console.log("Connected to MongoDB");
      return conn;
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });

  return connectionPromise;
}

export function getDb() {
  return mongoose.connection;
}
