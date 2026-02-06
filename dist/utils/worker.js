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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
const bullmq_1 = require("bullmq");
const pdfBuffer_1 = require("./pdfBuffer");
const cloudinary_1 = require("./cloudinary");
const order_model_1 = require("../models/order.model");
const errorHandler_midleware_1 = require("../midddleware/errorHandler.midleware");
const receipt_model_1 = require("../models/receipt.model");
const store_model_1 = require("../models/store.model");
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = require("../models/cart.model");
const user_model_1 = require("../models/user.model");
const product_model_1 = require("../models/product.model");
const nodemailerPdf_1 = require("./nodemailerPdf");
const redis_config_1 = require("../config/redis.config");
const express_1 = __importDefault(require("express"));
// mongoose.connect(process.env.MONGO_DB_URI as string);
//production
mongoose_1.default.set("bufferCommands", false);
const startWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.DB_CONNECTION_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("🟢 MongoDB connected (worker)");
        const worker = new bullmq_1.Worker("receipt-queue", (job) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            const { orderId } = job.data;
            const order = yield order_model_1.orderModel.findById(orderId);
            if (!order)
                throw (0, errorHandler_midleware_1.newCustomError)("No order found", 404);
            //check if receipt already exist
            const receipt = yield receipt_model_1.receiptModel.findOne({ orderId: order._id });
            if (receipt)
                throw (0, errorHandler_midleware_1.newCustomError)("receipt already exist", 422);
            //get user
            const isUser = order.customerId;
            const user = yield user_model_1.userModel.findOne({ _id: isUser });
            if (!user)
                throw (0, errorHandler_midleware_1.newCustomError)("No user found", 404);
            //get cart
            const cart = yield cart_model_1.cartModel.findById(order.cartId);
            const rawStoreId = cart === null || cart === void 0 ? void 0 : cart.items[0].storeId;
            const storeId = new mongoose_1.default.Types.ObjectId(rawStoreId);
            //get store
            const store = yield store_model_1.storeModel
                .findById(storeId)
                .populate({ path: "userId", model: "User" });
            // Check the product that was added to cart
            const product = yield product_model_1.productModel.findById(cart === null || cart === void 0 ? void 0 : cart.items[0].productId, {
                storeId: 1,
            });
            //custom Receipt no
            const rand = Math.floor(100 + Math.random() * 800);
            const receiptNo = `RCT-${Date.now()}-${rand}`;
            //pdf Generation
            const pdfBuffer = yield (0, pdfBuffer_1.pdfFileNew)({
                receiptNo: receiptNo.toString(),
                orderCode: (_a = order === null || order === void 0 ? void 0 : order.orderCode) !== null && _a !== void 0 ? _a : "N/A",
                customerName: (_b = user === null || user === void 0 ? void 0 : user.firstName) !== null && _b !== void 0 ? _b : "N/A",
                customerAddress: (_c = user === null || user === void 0 ? void 0 : user.address) !== null && _c !== void 0 ? _c : null,
                email: (_d = user === null || user === void 0 ? void 0 : user.email) !== null && _d !== void 0 ? _d : "N/A",
                items: (_e = cart === null || cart === void 0 ? void 0 : cart.items) !== null && _e !== void 0 ? _e : [],
                totalAmount: (_f = order === null || order === void 0 ? void 0 : order.totalPrice) !== null && _f !== void 0 ? _f : 0,
                paymentMethod: (_g = order === null || order === void 0 ? void 0 : order.paymentMethod) !== null && _g !== void 0 ? _g : "N/A",
                orderDate: order.createdAt,
                storeName: (_h = store === null || store === void 0 ? void 0 : store.storeName) !== null && _h !== void 0 ? _h : "N/A",
                storeEmail: (_j = (store === null || store === void 0 ? void 0 : store.userId).email) !== null && _j !== void 0 ? _j : "N/A",
                storePhoneNumber: (_l = (_k = store === null || store === void 0 ? void 0 : store.address) === null || _k === void 0 ? void 0 : _k.phoneNumber) !== null && _l !== void 0 ? _l : "N/A",
                storeAddress: (_m = store === null || store === void 0 ? void 0 : store.address) !== null && _m !== void 0 ? _m : null,
            });
            //save a copy to cloudinary
            const pdfUrl = yield (0, cloudinary_1.uploadCloudinary)(pdfBuffer, order._id.toString());
            if (!pdfUrl)
                throw (0, errorHandler_midleware_1.newCustomError)("unable to save file", 422);
            yield (0, nodemailerPdf_1.sendPdf)({
                email: user.email,
                subject: "Order Notification",
                emailInfo: {
                    customerName: `${user.firstName} ${user.lastName}`,
                    customerAddress: (_o = user === null || user === void 0 ? void 0 : user.address) !== null && _o !== void 0 ? _o : null,
                    orderCode: order.orderCode,
                    receiptNo: receiptNo,
                    items: cart === null || cart === void 0 ? void 0 : cart.items,
                    orderDate: order.createdAt,
                    storeName: store === null || store === void 0 ? void 0 : store.storeName,
                    storeEmail: (store === null || store === void 0 ? void 0 : store.userId).email,
                    storeAddress: (_p = store === null || store === void 0 ? void 0 : store.address) !== null && _p !== void 0 ? _p : null,
                    storePhoneNumber: (_q = store === null || store === void 0 ? void 0 : store.address) === null || _q === void 0 ? void 0 : _q.phoneNumber,
                    paymentMethod: order.paymentMethod,
                },
            }, pdfBuffer);
            //save receipt to DB
            yield receipt_model_1.receiptModel.create({
                orderId: order._id,
                customerId: isUser,
                storeId: store === null || store === void 0 ? void 0 : store._id,
                receiptNo: receiptNo,
                orderCode: (_r = order === null || order === void 0 ? void 0 : order.orderCode) !== null && _r !== void 0 ? _r : "N/A",
                items: cart === null || cart === void 0 ? void 0 : cart.items,
                totalAmount: order === null || order === void 0 ? void 0 : order.totalPrice,
                paymentMethod: order.paymentMethod,
                pdfUrl: pdfUrl,
            });
        }), {
            connection: redis_config_1.redis,
        });
        worker.on("completed", (job) => {
            console.log(`Receipt generated for order ${job.data.orderId}`);
        });
        worker.on("failed", (job, err) => {
            console.error("Receipt failed for order", err);
        });
    }
    catch (error) {
        console.error("🔴 Worker startup failed:", error);
        process.exit(1);
    }
});
startWorker();
const app = (0, express_1.default)();
// ---- Render requires a port binding ----
const PORT = Number(process.env.PORT);
app.get("/", (_req, res) => {
    res.send("Worker running");
});
app.listen(PORT, () => {
    console.log(`🌐 Worker dummy server listening on ${PORT}`);
});
