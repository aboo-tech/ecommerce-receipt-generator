import mongoose, { Schema, Types } from "mongoose";

export enum USER_TYPE {
  CUSTOMER = "customer",
  MERCHANT = "merchant",
}
const userSchema = new Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: {
    type: String,
    enum: ["customer", "store"],
  },
  otp: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phoneNumber: String,
  },
  nin: {
    type: String,
  },
  bvn: {
    type: String,
  },

  is_kyc_verified: { type: Boolean, require: true, default: false },

  is_verified: { type: Boolean, require: true, default: false },
 
},
{
  timestamps:true
}
);

export const userModel = mongoose.model("User", userSchema);
