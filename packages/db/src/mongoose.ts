import mongoose from "mongoose";


const globalForMongoose = global as typeof globalThis & {
  mongoose?: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
};


const cached = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

async function connectDB() {

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }

  cached.conn = await cached.promise;

  globalForMongoose.mongoose = cached;

  return cached.conn;
}

export default connectDB;
