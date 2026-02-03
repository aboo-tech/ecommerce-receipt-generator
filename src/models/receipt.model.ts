import { string } from "joi";
import mongoose, { Schema, Types } from "mongoose";

const receiptSchema = new Schema(
  {
    orderId: { type: Types.ObjectId, required: true, ref: "Order" },
    customerId: { type: Types.ObjectId, required: true, ref: "Customer" },
    storeId: { type: Types.ObjectId, required: true, ref: "Store" },
    receiptNo: { type: String, required: true },
    orderCode: { type: String, required: true },
    items: [],
    totalAmount: { type: Number, require: true },
    paymentMethod: {
      type: String,
      require: false,
      enum: ["paystack", "flutterwave", "stripe"],
    },
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const receiptModel = mongoose.model("Receipt", receiptSchema);
