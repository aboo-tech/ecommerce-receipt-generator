"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.USER_TYPE = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var USER_TYPE;
(function (USER_TYPE) {
    USER_TYPE["CUSTOMER"] = "customer";
    USER_TYPE["MERCHANT"] = "merchant";
})(USER_TYPE || (exports.USER_TYPE = USER_TYPE = {}));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: {
        type: String,
        enum: ["customer", "store"],
    },
    otp: { type: String },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phoneNumber: String,
    },
    nin: {
        type: String,
    },
    bvn: {
        type: String,
    },
    is_kyc_verified: { type: Boolean, require: true, default: false },
    is_verified: { type: Boolean, require: true, default: false },
}, {
    timestamps: true
});
exports.userModel = mongoose_1.default.model("User", userSchema);
