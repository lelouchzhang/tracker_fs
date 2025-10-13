import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// 全局可访问变量global.mongooseCache
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDB = async () => {
  if (!MONGODB_URI) throw new Error("必须设置MONGODB_URI,请检查.env文件");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    // conn是resolved的promise结果，是完整的mongoose实例，代表mongoose已连接和配置完毕
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  console.log(
    `Mongoose已成功连接至数据库：${process.env.NODE_ENV} - ${MONGODB_URI}`
  );

  return cached.conn;
};
