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
exports.CartService = void 0;
const mongoose_1 = require("mongoose");
const cart_validate_1 = require("../validators/cart.validate");
const errorHandler_midleware_1 = require("../midddleware/errorHandler.midleware");
const product_model_1 = require("../models/product.model");
const cart_model_1 = require("../models/cart.model");
class CartService {
}
exports.CartService = CartService;
_a = CartService;
CartService.addToCart = (data, customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = cart_validate_1.cartValid.validate(data);
    if (error)
        throw (0, errorHandler_midleware_1.newCustomError)(error.message, 400);
    //check id type
    if (!mongoose_1.Types.ObjectId.isValid(data.productId)) {
        throw (0, errorHandler_midleware_1.newCustomError)("Invalid ProductId", 422);
    }
    //find product
    const product = yield product_model_1.productModel
        .findById(new mongoose_1.Types.ObjectId(data.productId))
        .lean();
    if (!product)
        throw (0, errorHandler_midleware_1.newCustomError)("No product found", 404);
    //check quantity
    if (data.quantity > product.quantity)
        throw (0, errorHandler_midleware_1.newCustomError)("Out of Stock", 422);
    //get user cart
    const cart = yield cart_model_1.cartModel.findOne({ customerId });
    if (!cart) {
        //create cart
        const response = yield cart_model_1.cartModel.create({
            customerId,
            items: [
                {
                    storeId: product.storeId,
                    productId: data.productId,
                    productName: product.productName,
                    quantity: data.quantity,
                    price: product.price,
                },
            ],
            totalPrice: product.price * data.quantity,
        });
        return {
            success: true,
            message: "added to cart",
            data: response,
        };
    }
    else {
        const rdx = cart === null || cart === void 0 ? void 0 : cart.items.findIndex((item) => item.productId.toString() === data.productId.toString());
        if (rdx > -1) {
            cart.items[rdx].quantity = data.quantity;
        }
        else {
            cart.items.push({
                storeId: product.storeId,
                productId: data.productId,
                productName: product.productName,
                quantity: data.quantity,
                price: product.price,
            });
        }
        const sum = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        cart.totalPrice = sum;
        yield cart.save();
        return {
            success: true,
            message: "Cart updated",
            data: cart,
        };
    }
});
