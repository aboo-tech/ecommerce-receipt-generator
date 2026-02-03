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
exports.MarketPlaceController = void 0;
const asyncWrapper_1 = require("../midddleware/asyncWrapper");
const order_1 = require("../services/order");
const cart_services_1 = require("../services/cart.services");
const user_services_1 = require("../services/user.services");
const product_services_1 = require("../services/product.services");
class MarketPlaceController {
}
exports.MarketPlaceController = MarketPlaceController;
_a = MarketPlaceController;
MarketPlaceController.createPoduct = (0, asyncWrapper_1.asyncWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.body;
    const userId = req.user.id;
    const response = yield product_services_1.ProductService.createProduct(product, userId);
    res.status(200).json({ success: true, payload: response });
}));
MarketPlaceController.addToCart = (0, asyncWrapper_1.asyncWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const userId = req.user.id;
    const response = yield cart_services_1.CartService.addToCart(data, userId);
    res.status(201).json({ success: true, payload: response });
}));
MarketPlaceController.order = (0, asyncWrapper_1.asyncWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const cartId = (_b = req.body) === null || _b === void 0 ? void 0 : _b.cartId;
    const customerId = req.user.id;
    const response = yield order_1.Order.createOrder(cartId, customerId);
    res.status(200).json({ success: true, payload: response });
}));
MarketPlaceController.webhook = (0, asyncWrapper_1.asyncWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
    const response = yield order_1.Order.webhook(id);
    res.status(201).json({ status: true, payload: response });
}));
MarketPlaceController.receiptHistory = (0, asyncWrapper_1.asyncWrapper)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = req.user.id;
    const response = yield user_services_1.UserService.receiptHistory(storeId);
    res.status(201).json({ status: true, payload: response });
}));
