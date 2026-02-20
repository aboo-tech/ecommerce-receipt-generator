import dotenv from "dotenv";
dotenv.config({ quiet: true });

import IORedis from "ioredis";
import { redis_url } from "./system.variable";
import { ConnectionOptions } from "bullmq";

// const connection: ConnectionOptions = {
//   connection: process.env.redis_url as string,
// };
// export const redis = new IORedis(process.env.REDIS_URL as string, {
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
//   retryStrategy(times) {
//     return Math.min(times * 100, 3000);
//   },
// });

// const connection = {
//   connection: process.env.REDIS_URL,
//   // optional ioredis options BullMQ supports
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
//   retryStrategy(times: number) {
//     return Math.min(times * 100, 3000);
//   },
// };

export const connection = {
  connection: process.env.REDIS_URL,
  // optional ioredis options BullMQ supports
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times: number) {
    return Math.min(times * 100, 3000);
  },
};

// connection.on("connect", () => console.log("Redis connected"));
// connection.on("error", (err) => console.error("Redis error", err));
// redis.on("close", () => console.log("Redis connection closed"));

// export default redis;
