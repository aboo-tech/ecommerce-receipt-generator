"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptQueue = exports.mongoConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const system_variable_1 = require("./system.variable");
const bullmq_1 = require("bullmq");
const redis_config_1 = require("../config/redis.config");
mongoose_1.default.connection.on("connecting", () => {
    console.log("🟡 Connecting to MongoDB...");
});
mongoose_1.default.connection.on("connected", () => {
    console.log("🟢 MongoDB connected");
});
mongoose_1.default.connection.on("error", (err) => {
    console.error("🔴 MongoDB connection error:", err);
});
const mongoConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(`${system_variable_1.dbUri}`, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("Database connected");
    }
    catch (error) {
        console.log("Database disconnected,", error);
        process.exit(1);
    }
});
exports.mongoConnection = mongoConnection;
// queues/receipt.queue.ts
exports.receiptQueue = new bullmq_1.Queue("receipt-queue", {
    connection: redis_config_1.redis,
});
