import IORedis from "ioredis";
import { redis_host, redis_port, redis_url } from "./system.variable";

export const createRedisConnection = () => {
  return new IORedis(redis_url, {
    maxRetriesPerRequest: null, //
  });
};
