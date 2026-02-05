import dotenv from "dotenv";
dotenv.config({ quiet: true });

import IORedis from "ioredis";
import { redis_host, redis_port, redis_url } from "./system.variable";

// export const createRedisConnection = () => {
//   return new IORedis(redis_url, {
//     maxRetriesPerRequest: null, //
//   });
// };

export const redis = new IORedis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error", err));
redis.on("close", () => console.log("Redis connection closed"));

// export default redis;
