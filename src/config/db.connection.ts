import mongoose from "mongoose";
import { dbUri } from "./system.variable";
import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis.config";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(`${dbUri}`);
    console.log("Database connected");
  } catch (error) {
    console.log("Database disconnected");
  }
};

// queues/receipt.queue.ts
export const receiptQueue = new Queue("receipt-queue", {
  connection: createRedisConnection(),
});
