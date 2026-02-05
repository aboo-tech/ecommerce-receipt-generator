"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
const ioredis_1 = __importDefault(require("ioredis"));
// export const createRedisConnection = () => {
//   return new IORedis(redis_url, {
//     maxRetriesPerRequest: null, //
//   });
// };
exports.redis = new ioredis_1.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
        return Math.min(times * 100, 3000);
    },
});
exports.redis.on("connect", () => console.log("Redis connected"));
exports.redis.on("error", (err) => console.error("Redis error", err));
exports.redis.on("close", () => console.log("Redis connection closed"));
// export default redis;
