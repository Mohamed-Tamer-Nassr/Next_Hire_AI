import mongoose from "mongoose";

/************************************************************/
// ALL of this implementation for just caching the data
// I think this implementation could be added in any application you build
// I think there is no difference but also ask LLM for that

const MONGODB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGODB_URI_LOCAL!
    : process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCached;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

/************************************************************/
