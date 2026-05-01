import mongoose from "mongoose";

import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = globalCache;

export async function connectToDatabase() {
  const env = getEnv();

  if (!env.MONGODB_URI) {
    logger.warn(
      "MONGODB_URI is not configured. Database-backed pages will render without job data.",
    );
    return null;
  }

  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      bufferCommands: false,
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
