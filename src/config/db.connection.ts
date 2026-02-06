import mongoose from "mongoose";
import { dbUri } from "./system.variable";
import { Queue } from "bullmq";
import { redis } from "../config/redis.config";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(`${dbUri}`, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Database connected");
  } catch (error) {
    console.log("Database disconnected,", error);
    process.exit(1);
  }
};

// queues/receipt.queue.ts
export const receiptQueue = new Queue("receipt-queue", {
  connection: redis,
});
