import mongoose, { Schema, Types } from "mongoose";

export const orderSchema = new Schema(
  {
    customerId: { type: Types.ObjectId, ref: "Customer", require: true },
    cartId: { type: Types.ObjectId, ref: "Cart", require: true },
    subTotal: { type: Number, require: true }, //total unit price
    shippingFee: { type: Number },
    orderCode: { type: String, require: true },
    totalAmount: { type: Number, require: true },
    paymentRef: { type: String, require: false },
    paymentMethod: {
      type: String,
      require: false,
      enum: ["paystack", "flutterwave", "stripe"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: ["draft", "cancled", "refunded", "completed"],
    },
    shippingAddress: {
      street: { type: String, require: true },
      city: { type: String, require: true },
      state: { type: String, require: true },
    },
    currency: { type: String, require: true },
    totalPrice: { type: Number, require: true },
  },
  {
    timestamps: true,
  },
);

export const orderModel = mongoose.model("Order", orderSchema);
