import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in environment variables!");
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  return mongoose.connect(MONGODB_URI);
}
