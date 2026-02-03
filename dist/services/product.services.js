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
exports.ProductService = void 0;
const errorHandler_midleware_1 = require("../midddleware/errorHandler.midleware");
const product_model_1 = require("../models/product.model");
const product_validate_1 = require("../validators/product.validate");
const store_model_1 = require("../models/store.model");
class ProductService {
}
exports.ProductService = ProductService;
_a = ProductService;
ProductService.createProduct = (product, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = product_validate_1.prdt.validate(product);
    if (error)
        throw (0, errorHandler_midleware_1.newCustomError)(error.message, 400);
    //check price
    if (product.price < 0) {
        throw (0, errorHandler_midleware_1.newCustomError)("Price must be greater than 9", 409);
    }
    //create a slug
    const slug = product.productName.toLowerCase().trim().replace(/\s+/g, "-");
    //storeId
    const store = yield store_model_1.storeModel.findOne({ userId });
    //chek if product exist
    const isProductExist = yield product_model_1.productModel
        .findOne({ slug, storeId: store === null || store === void 0 ? void 0 : store._id })
        .populate({
        path: "storeId",
        model: "Store",
    });
    if (isProductExist)
        throw (0, errorHandler_midleware_1.newCustomError)("Product already exist", 422);
    //create product
    const response = yield product_model_1.productModel.create(Object.assign(Object.assign({}, product), { storeId: store === null || store === void 0 ? void 0 : store._id, slug }));
    if (!response)
        throw (0, errorHandler_midleware_1.newCustomError)("Unable to create a new product", 409);
    return "New product added";
});
