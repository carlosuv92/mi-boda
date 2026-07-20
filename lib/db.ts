import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

let conn: typeof mongoose | null = null;
let promise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  if (conn) return conn;
  if (!promise) {
    promise = mongoose.connect(MONGODB_URI as string);
  }
  conn = await promise;
  return conn;
}
