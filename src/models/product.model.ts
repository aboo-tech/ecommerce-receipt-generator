import mongoose, { Schema, Types } from "mongoose";
import { ref } from "process";

export const productSchema = new Schema(
  {
    storeId: { type: Types.ObjectId, ref: "Store" },
    productName: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: false },
    quantity: { type: Number, required: true },
    sku: { type: String },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const productModel = mongoose.model("Product", productSchema);
