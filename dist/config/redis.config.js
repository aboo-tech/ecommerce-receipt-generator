"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const system_variable_1 = require("./system.variable");
const createRedisConnection = () => {
    return new ioredis_1.default({
        host: system_variable_1.redis_host,
        port: system_variable_1.redis_port,
        maxRetriesPerRequest: null, //
    });
};
exports.createRedisConnection = createRedisConnection;
