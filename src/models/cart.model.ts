import mongoose, { Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    customerId: { type: Types.ObjectId, ref: "Customer", require: true },
    items: [],
    totalPrice: { type: Number, require: true },
  },
  { timestamps: true },
);

export const cartModel = mongoose.model("Cart", cartSchema);
