"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const marketPlace_controller_1 = require("../controllers/marketPlace.controller");
const auth_middleware_1 = require("../midddleware/auth.middleware");
const router = express_1.default.Router();
router.post("/auth/pre-register", auth_controller_1.AuthController.preRegister);
router.post("/auth/register", auth_controller_1.AuthController.register);
router.post("/auth/login", auth_controller_1.AuthController.login);
//**************************|| Market Management ||************************\\
router.post("/inventory", auth_middleware_1.authMiddleware, auth_middleware_1.storeMiddleware, marketPlace_controller_1.MarketPlaceController.createPoduct);
router.post("/cart", auth_middleware_1.authMiddleware, auth_middleware_1.customerMiddleware, marketPlace_controller_1.MarketPlaceController.addToCart);
router.post("/order", auth_middleware_1.authMiddleware, auth_middleware_1.customerMiddleware, marketPlace_controller_1.MarketPlaceController.order);
router.get("/", (req, res) => {
    res.send("E-commerce Receipt API is running ✅");
});
router.get("/receipt", auth_middleware_1.authMiddleware, auth_middleware_1.storeMiddleware, marketPlace_controller_1.MarketPlaceController.receiptHistory);
router.post("/webhook/:id", marketPlace_controller_1.MarketPlaceController.webhook);
exports.default = router;
