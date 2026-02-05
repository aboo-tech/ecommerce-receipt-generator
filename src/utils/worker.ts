// workers/receipt.worker.ts
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import { Worker } from "bullmq";
import { pdfFileNew } from "./pdfBuffer";
import { uploadCloudinary } from "./cloudinary";
import { orderModel } from "../models/order.model";
import { newCustomError } from "../midddleware/errorHandler.midleware";
import { receiptModel } from "../models/receipt.model";
import { storeModel } from "../models/store.model";
import mongoose from "mongoose";
import { cartModel } from "../models/cart.model";
import { userModel } from "../models/user.model";
import { productModel } from "../models/product.model";
import { sendPdf } from "./nodemailerPdf";
import { redis } from "../config/redis.config";
import express, { Request, Response } from "express";

mongoose.connect(process.env.MONGO_DB_URI as string);

const worker = new Worker(
  "receipt-queue",
  async (job) => {
    const { orderId } = job.data;
    const order = await orderModel.findById(orderId);
    if (!order) throw newCustomError("No order found", 404);
    //check if receipt already exist

    const receipt = await receiptModel.findOne({ orderId: order._id });
    if (receipt) throw newCustomError("receipt already exist", 422);

    //get user
    const isUser = order.customerId as any;
    const user = await userModel.findOne({ _id: isUser });
    if (!user) throw newCustomError("No user found", 404);
    //get cart
    const cart = await cartModel.findById(order.cartId);
    const rawStoreId = cart?.items[0].storeId;
    const storeId = new mongoose.Types.ObjectId(rawStoreId);

    //get store
    const store = await storeModel
      .findById(storeId)
      .populate({ path: "userId", model: "User" });

    // Check the product that was added to cart
    const product = await productModel.findById(cart?.items[0].productId, {
      storeId: 1,
    });

    //custom Receipt no
    const rand = Math.floor(100 + Math.random() * 800);
    const receiptNo = `RCT-${Date.now()}-${rand}`;
    //pdf Generation
    const pdfBuffer = await pdfFileNew({
      receiptNo: receiptNo.toString(),
      orderCode: order?.orderCode ?? "N/A",
      customerName: user?.firstName ?? "N/A",
      customerAddress: user?.address ?? null,
      email: user?.email ?? "N/A",
      items: cart?.items ?? [],
      totalAmount: order?.totalPrice ?? 0,
      paymentMethod: order?.paymentMethod ?? "N/A",
      orderDate: order.createdAt,
      storeName: store?.storeName ?? "N/A",
      storeEmail: (store?.userId as any).email ?? "N/A",
      storePhoneNumber: store?.address?.phoneNumber ?? "N/A",
      storeAddress: store?.address ?? null,
    });

    //save a copy to cloudinary
    const pdfUrl = await uploadCloudinary(pdfBuffer, order._id.toString());
    if (!pdfUrl) throw newCustomError("unable to save file", 422);

    await sendPdf(
      {
        email: user.email as any,
        subject: "Order Notification",
        emailInfo: {
          customerName: `${user.firstName} ${user.lastName}`,
          customerAddress: user?.address ?? null,
          orderCode: order.orderCode,
          receiptNo: receiptNo,
          items: cart?.items,
          orderDate: order.createdAt,
          storeName: store?.storeName,
          storeEmail: (store?.userId as any).email,
          storeAddress: store?.address ?? null,
          storePhoneNumber: store?.address?.phoneNumber,
          paymentMethod: order.paymentMethod,
        },
      },

      pdfBuffer,
    );
    //save receipt to DB
    await receiptModel.create({
      orderId: order._id,
      customerId: isUser,
      storeId: store?._id,
      receiptNo: receiptNo,
      orderCode: order?.orderCode ?? "N/A",
      items: cart?.items,
      totalAmount: order?.totalPrice,
      paymentMethod: order.paymentMethod,
      pdfUrl: pdfUrl,
    });
  },
  {
    connection: redis,
  },
);

worker.on("completed", (job) => {
  console.log(`Receipt generated for order ${job.data.orderId}`);
});

worker.on("failed", (job, err) => {
  console.error("Receipt failed for order", err);
});

// Dummy HTTP server for Render port detection
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_: Request, res: Response) => {
  res.send("Worker is running");
});

app.listen(PORT, () => {
  console.log(`🌐 Worker dummy server listening on ${PORT}`);
});
