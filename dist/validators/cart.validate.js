"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartValid = exports.cartItemValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.cartItemValidate = joi_1.default.object({
    productId: joi_1.default.string().required(),
    productName: joi_1.default.string().trim().min(2).max(100).required(),
    unitPrice: joi_1.default.number().positive().required(),
    quantity: joi_1.default.number().integer().min(1).required(),
});
exports.cartValid = joi_1.default.object({
    productId: joi_1.default.string().required(),
    quantity: joi_1.default.string().min(1).required(),
});
// productid;
// qty;
