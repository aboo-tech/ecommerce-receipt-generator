import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { MarketPlaceController } from "../controllers/marketPlace.controller";
import {
  authMiddleware,
  customerMiddleware,
  storeMiddleware,
} from "../midddleware/auth.middleware";
import { custom } from "joi";

const router = express.Router();

router.post("/auth/pre-register", AuthController.preRegister);
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

//**************************|| Market Management ||************************\\
router.post(
  "/inventory",
  authMiddleware as any,
  storeMiddleware as any,
  MarketPlaceController.createPoduct,
);
router.post(
  "/cart",
  authMiddleware as any,
  customerMiddleware as any,
  MarketPlaceController.addToCart,
);
router.post(
  "/order",
  authMiddleware as any,
  customerMiddleware as any,
  MarketPlaceController.order,
);
router.get("/", (req, res) => {
  res.send("E-commerce Receipt API is running ✅");
});

router.get(
  "/receipt",
  authMiddleware as any,
  storeMiddleware as any,
  MarketPlaceController.receiptHistory,
);

router.post("/webhook/:id", MarketPlaceController.webhook);

export default router;
