import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const MONGODB_URI: string = uri;

const globalForMongoose = global as typeof globalThis & {
  mongoose?: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
};


let cached = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongoose = cached;

if(!cached) {
  cached = globalForMongoose.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB(){
  if(cached.conn){
    return cached.conn;
  }

  if(!cached.promise){
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default connectDB;
