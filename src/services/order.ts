import mongoose, { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import { newCustomError } from "../midddleware/errorHandler.midleware";
import { userModel } from "../models/user.model";
import { orderModel } from "../models/order.model";
import { receiptQueue } from "../config/db.connection";
import { receiptModel } from "../models/receipt.model";

export class Order {
  static createOrder = async (cartId: string, customerId: Types.ObjectId) => {
    try {
      const user = await userModel.findById(customerId);
      if (!user) throw newCustomError("No user found", 404);
      //find cart
      const cart = await cartModel.findById(cartId).lean();
      if (!cart) throw newCustomError("No cart found", 404);
      const orderCode = `ORD-${Date.now()}`;
      //check if order already exist
      const isOrder = await orderModel.findOne({ cartId });
      if (isOrder) throw newCustomError("order exist", 409);
      const order = await orderModel.create({
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
      if (!order) throw newCustomError("Unable to create order", 500);
      return {
        success: true,
        message: "order Complete",
      };
    } catch (error: any) {
      throw error;
    }
  };

  static webhook = async (id: string) => {
    if (!id) throw newCustomError("Invalid Id", 409);
    const payload = await orderModel.findOne({ _id: id });
    if (!payload) throw newCustomError("No Order found", 404);
    if (payload.status === "completed" && payload.paymentStatus === "success") {
      //check if receipt already exist
      const receipt = await receiptModel.findOne({ orderId: id });
      if (receipt) {
        throw newCustomError("Receipt already exist for this order", 422);
      }

      //background jobs for generating receipt
      await receiptQueue.add(
        "receipt-queue",
        { orderId: payload._id.toString() },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: true,
        },
      );
    }
    return "Payment Successful, Receipt has been sent to your email";
  };
}
