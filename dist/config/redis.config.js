"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
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
exports.connection = {
    connection: process.env.REDIS_URL,
    // optional ioredis options BullMQ supports
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
        return Math.min(times * 100, 3000);
    },
};
// connection.on("connect", () => console.log("Redis connected"));
// connection.on("error", (err) => console.error("Redis error", err));
// redis.on("close", () => console.log("Redis connection closed"));
// export default redis;
