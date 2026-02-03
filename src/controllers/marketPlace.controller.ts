import { Response } from "express";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import { IRequest } from "../midddleware/auth.middleware";
import { Cart } from "../interface/cart.interface";
import { Order } from "../services/order";
import { CartService } from "../services/cart.services";
import { UserService } from "../services/user.services";
import { ProductService } from "../services/product.services";
import { Types } from "mongoose";

export class MarketPlaceController {
  static createPoduct = asyncWrapper(async (req: IRequest, res: Response) => {
    const product = req.body;
    const userId = req.user.id;
    const response = await ProductService.createProduct(product, userId);
    res.status(200).json({ success: true, payload: response });
  });
  static addToCart = asyncWrapper(async (req: IRequest, res: Response) => {
    const data = req.body as Cart;
    const userId = req.user.id;
    const response = await CartService.addToCart(data, userId);
    res.status(201).json({ success: true, payload: response });
  });

  static order = asyncWrapper(async (req: IRequest, res: Response) => {
    const cartId = req.body?.cartId;
    const customerId = req.user.id;
    const response = await Order.createOrder(cartId, customerId);
    res.status(200).json({ success: true, payload: response });
  });
  static webhook = asyncWrapper(async (req: IRequest, res: Response) => {
    const id = req.params?.id as string;
    const response = await Order.webhook(id);
    res.status(201).json({ status: true, payload: response });
  });

  static receiptHistory = asyncWrapper(async (req: IRequest, res: Response) => {
    const storeId = req.user.id;
    const response = await UserService.receiptHistory(storeId);
    res.status(201).json({ status: true, payload: response });
  });
}
