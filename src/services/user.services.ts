import { IPreRegister, IRegister } from "../interface/user.interface";
import { newCustomError } from "../midddleware/errorHandler.midleware";
import { customerModel } from "../models/customer.model";
import { storeModel } from "../models/store.model";
import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";
import { otpTemplate } from "../utils/otpTemp";
import crypto from "crypto";
import { otpModel } from "../models/otp.model";
import Jwt from "jsonwebtoken";
import { login, preValidate, register } from "../validators/user.validate";
import { loginTemplate } from "../utils/loginTemp";
import { jwt_exp, jwt_secret } from "../config/system.variable";
import { receiptModel } from "../models/receipt.model";
import { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import { sendEmail } from "../utils/resendMailer";

export class UserService {
  static preRegister = async (user: IPreRegister) => {
    //validate user input
    const { error } = preValidate.validate(user);

    if (error) {
      throw newCustomError(error.message, 422);
    }
    user.firstName = user.firstName.toLowerCase();
    user.lastName = user.lastName.toLowerCase();
    user.email = user.email.toLowerCase();

    // check if user exists
    const isFound = await userModel.findOne({ email: user.email });

    // verify account state
    if (isFound?.is_verified === false)
      throw newCustomError("Please verify your account", 400);
    if (isFound) throw newCustomError("Sorry, you can not use this email", 409);
    // generate password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!hashedPassword) throw newCustomError("Password hashing failed", 400);

    // if user  does not exist  create user
    const response = await userModel.create({
      ...user,
      password: hashedPassword,
      is_verified: false,
    });
    if (!response) throw newCustomError("Unable to create account", 500);

    // gen role
    if (response.role === "customer") {
      const role = await customerModel.create({
        ...response._id,
        userId: response._id,
        address: response?.address,
      });
      if (!role) {
        throw newCustomError("Unable to create a Customer account", 500);
      }
    }
    if (response.role === "store") {
      const genStoreName = `${user.firstName.trim()}'s Store`;
      const merchantRole = storeModel.create({
        ...response._id,
        userId: response._id,
        storeName: genStoreName,
        address: response.address,
      });
      if (!merchantRole) {
        throw newCustomError("Unable to create a Merchant account", 500);
      }
    }
    // gen otp
    const otp = await UserService.genOtp(user.email);
    if (!otp) {
      throw newCustomError("OTP generation failed", 400);
    }
    // send otp via mail
    sendEmail(
      {
        email: user.email,
        subject: "OTP VERIFICATION",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.lastName} ${user.firstName}`,
        },
      },
      otpTemplate,
    );
    // send response to the user
    return "Account created Successfully. Please check your email for OTP to continue";
  };

  static register = async (user: IRegister) => {
    const { error } = register.validate(user);
    if (error) throw newCustomError(error.message, 400);
    //check email valid
    const validUser = await userModel.findOne({ email: user.email });
    if (!validUser) throw newCustomError("No record found", 404);
    //check if user is registered
    if (validUser.is_verified)
      throw newCustomError("Acoount already exist, Login Instead.", 409);

    //chek if Otp still exist
    const otpExist = await otpModel.findOne({ email: user.email });
    if (!otpExist) throw newCustomError("OTP Expired", 401);
    //check otp validity
    const otpValid = await bcrypt.compare(
      user.otp.toString(),
      otpExist.otp as string,
    );
    if (!otpValid) throw newCustomError("Invalid OTP", 401);
    //verify user
    const verify = await userModel.findByIdAndUpdate(
      validUser._id,
      { is_verified: true },
      { new: true },
    );
    if (!verify) throw newCustomError("Unable to verify account", 422);
    return "Account Verified. You can now login";
  };

  static login = async (
    email: string,
    password: string,
    // ipAddress: string,
    // userAgent: string,
  ) => {
    const { error } = login.validate({ email, password });
    if (error) throw newCustomError(error.message, 400);
    //check email
    const userValid = await userModel.findOne({ email });
    if (!userValid) throw newCustomError("Invalid email", 404);
    //password validate
    const isPwdAuth = await bcrypt.compare(
      password,
      userValid.password as string,
    );
    if (!isPwdAuth) throw newCustomError("Invalid email/password", 401);
    //save to payload
    const payload = {
      userId: userValid._id,
      userType: userValid.role,
    };
    let jwtkey = Jwt.sign(payload, jwt_secret, { expiresIn: jwt_exp as any });
    if (!jwtkey) throw newCustomError("Unable to Login at this moment", 401);
    //send mail
    sendEmail(
      {
        email: email,
        subject: "Login Attempt",
        emailInfo: {
          //   ipAddress: ipAddress,
          //   userAgent: userAgent,
        },
      },
      loginTemplate,
    );
    return {
      message: "Login Successful",
      authKey: jwtkey,
    };
  };

  static genOtp = async (email: string) => {
    const otp = crypto.randomInt(100000, 999999);
    console.log(otp);
    //hash otp
    const hashOtp = await bcrypt.hash(otp.toString(), 5);
    //delete old OTP
    const deleteOtp = await otpModel.findOneAndDelete({ email });
    await otpModel.create({ email, otp: hashOtp });
    return otp;
  };
  static receiptHistory = async (storeId: Types.ObjectId) => {
    const store = await storeModel.findById(storeId);
    // if(!store)throw newCustomError("invalid store",404)
    console.log("store", store);
    const response = await receiptModel.find(store?._id);
    if (!response) throw newCustomError("No receipt found", 404);
    console.log("response", response);
    return response;
  };
}
