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
exports.storeMiddleware = exports.customerMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const user_model_1 = require("../models/user.model");
const system_variable_1 = require("../config/system.variable");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split("Bearer ")[1];
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, system_variable_1.jwt_secret, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.sendStatus(401);
        }
        const user = yield user_model_1.userModel.findById(new mongoose_1.Types.ObjectId(data.userId));
        console.log(data);
        if (!user)
            return res.sendStatus(401);
        req.user = {
            email: user.email,
            id: user._id,
            is_verified: user.is_verified,
            role: user.role,
        };
        next();
    }));
};
exports.authMiddleware = authMiddleware;
const customerMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user)
        return res.sendStatus(403);
    if (user.role !== "customer")
        return res
            .status(403)
            .json({ payload: "You are not authorized to access this resource" });
    next();
};
exports.customerMiddleware = customerMiddleware;
const storeMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user)
        return res.sendStatus(403);
    if (user.role !== "store")
        return res.status(403).json({
            status: false,
            payload: "You are not authorized to access this resource",
        });
    next();
};
exports.storeMiddleware = storeMiddleware;
