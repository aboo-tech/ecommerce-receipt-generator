"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prdt = void 0;
const joi_1 = __importDefault(require("joi"));
exports.prdt = joi_1.default.object({
    productName: joi_1.default.string().trim().min(2).max(100).required(),
    description: joi_1.default.string().trim().min(10).max(500).allow(null, ""),
    price: joi_1.default.number().min(1).required(),
    discountedPrice: joi_1.default.number().min(1).optional(),
    quantity: joi_1.default.number().min(1).required(),
    isActive: joi_1.default.boolean().optional(),
    tags: joi_1.default.array().items(joi_1.default.string()).optional(),
});
