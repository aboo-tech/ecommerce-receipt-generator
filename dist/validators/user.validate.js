"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePwd = exports.profileSchema = exports.resetValidate = exports.kycValidate = exports.login = exports.register = exports.preValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.preValidate = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(30).required().trim(),
    lastName: joi_1.default.string().min(2).max(30).required().trim(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string()
        .trim()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).+$/)
        .messages({
        "string.pattern.base": "Password must include lowercase, uppercase, number and special character.",
        "string.min": "Password must be at least 7 characters",
    })
        .required(),
    address: joi_1.default.object({
        street: joi_1.default.string().optional(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().optional(),
        zip: joi_1.default.number().optional(),
        country: joi_1.default.string().required(),
        phoneNumber: joi_1.default.string().optional(),
    }).required(),
    role: joi_1.default.string().valid("customer", "store").required().trim(),
});
exports.register = joi_1.default.object({
    email: joi_1.default.string().email().required().trim(),
    otp: joi_1.default.string().length(6).required(),
});
exports.login = joi_1.default.object({
    email: joi_1.default.string().email().required().trim(),
    password: joi_1.default.string().required().min(8),
});
exports.kycValidate = joi_1.default.object({
    dateOfBirth: joi_1.default.string().required(),
    nin: joi_1.default.string().length(11).required(),
    bvn: joi_1.default.string().length(11).required(),
});
exports.resetValidate = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().required(),
    newPassword: joi_1.default.string().required(),
});
exports.profileSchema = joi_1.default.object({
    firstName: joi_1.default.string().optional().trim().min(2),
    lastName: joi_1.default.string().optional().min(2).trim(),
    displayName: joi_1.default.string().optional().min(2),
    address: joi_1.default.string().optional().min(5),
    phoneNumber: joi_1.default.string().optional().min(11),
    path: joi_1.default.string().optional(),
});
exports.updatePwd = joi_1.default.object({
    password: joi_1.default.string()
        .trim()
        .required()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$^&*)(=+|)]).+$/)
        .messages({
        "string.pattern.base": "Password must include lowercase, uppercase, number and special character.",
        "string.min": "Password must be at least 8 characters",
    }),
    confirmPassword: joi_1.default.string()
        .required()
        .trim()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$^&*)(=+|)]).+$/)
        .messages({
        "string.pattern.base": "Password must include lowercase, uppercase, number and special character.",
        "string.min": "Password must be at least 8 characters",
    }),
});
