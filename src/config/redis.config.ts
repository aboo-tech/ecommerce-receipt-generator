import IORedis from "ioredis";
import { redis_host, redis_port } from "./system.variable";

export const createRedisConnection = () => {
  return new IORedis({
    host: redis_host,
    port: redis_port,
    maxRetriesPerRequest: null, //
  });
};
