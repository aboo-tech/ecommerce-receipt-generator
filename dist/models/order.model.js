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
exports.orderModel = exports.orderSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.orderSchema = new mongoose_1.Schema({
    customerId: { type: mongoose_1.Types.ObjectId, ref: "Customer", require: true },
    cartId: { type: mongoose_1.Types.ObjectId, ref: "Cart", require: true },
    subTotal: { type: Number, require: true }, //total unit price
    shippingFee: { type: Number },
    orderCode: { type: String, require: true },
    totalAmount: { type: Number, require: true },
    paymentRef: { type: String, require: false },
    paymentMethod: {
        type: String,
        require: false,
        enum: ["paystack", "flutterwave", "stripe"],
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
        require: true,
    },
    status: {
        type: String,
        require: true,
        enum: ["draft", "cancled", "refunded", "completed"],
    },
    shippingAddress: {
        street: { type: String, require: true },
        city: { type: String, require: true },
        state: { type: String, require: true },
    },
    currency: { type: String, require: true },
    totalPrice: { type: Number, require: true },
}, {
    timestamps: true,
});
exports.orderModel = mongoose_1.default.model("Order", exports.orderSchema);
