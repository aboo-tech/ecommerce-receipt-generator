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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const cart_model_1 = require("../models/cart.model");
const errorHandler_midleware_1 = require("../midddleware/errorHandler.midleware");
const user_model_1 = require("../models/user.model");
const order_model_1 = require("../models/order.model");
const db_connection_1 = require("../config/db.connection");
const receipt_model_1 = require("../models/receipt.model");
class Order {
}
exports.Order = Order;
_a = Order;
Order.createOrder = (cartId, customerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.userModel.findById(customerId);
        if (!user)
            throw (0, errorHandler_midleware_1.newCustomError)("No user found", 404);
        //find cart
        const cart = yield cart_model_1.cartModel.findById(cartId).lean();
        if (!cart)
            throw (0, errorHandler_midleware_1.newCustomError)("No cart found", 404);
        const orderCode = `ORD-${Date.now()}`;
        //check if order already exist
        const isOrder = yield order_model_1.orderModel.findOne({ cartId });
        if (isOrder)
            throw (0, errorHandler_midleware_1.newCustomError)("order exist", 409);
        const order = yield order_model_1.orderModel.create({
            customerId,
            cartId,
            orderCode,
            subTotal: cart.totalPrice,
            paymentMethod: "paystack",
            status: "completed",
            paymentStatus: "success",
            currency: "NGN",
            totalPrice: cart.totalPrice,
        });
        if (!order)
            throw (0, errorHandler_midleware_1.newCustomError)("Unable to create order", 500);
        return {
            success: true,
            message: "order Complete",
        };
    }
    catch (error) {
        throw error;
    }
});
Order.webhook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw (0, errorHandler_midleware_1.newCustomError)("Invalid Id", 409);
    const payload = yield order_model_1.orderModel.findOne({ _id: id });
    if (!payload)
        throw (0, errorHandler_midleware_1.newCustomError)("No Order found", 404);
    if (payload.status === "completed" && payload.paymentStatus === "success") {
        //check if receipt already exist
        const receipt = yield receipt_model_1.receiptModel.findOne({ orderId: id });
        if (receipt) {
            throw (0, errorHandler_midleware_1.newCustomError)("Receipt already exist for this order", 422);
        }
        //background jobs for generating receipt
        yield db_connection_1.receiptQueue.add("receipt-queue", { orderId: payload._id.toString() }, {
            attempts: 3,
            backoff: { type: "exponential", delay: 5000 },
            removeOnComplete: true,
        });
    }
    return "Payment Successful, Receipt has been sent to your email";
});
