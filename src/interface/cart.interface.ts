import { Types } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  merchantId: Types.ObjectId | string;
  productName: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  productId: string;
  quantity: number;
}
