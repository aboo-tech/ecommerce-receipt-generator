"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const errorHandler_midleware_1 = require("../midddleware/errorHandler.midleware");
const customer_model_1 = require("../models/customer.model");
const store_model_1 = require("../models/store.model");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = require("../utils/nodemailer");
const otpTemp_1 = require("../utils/otpTemp");
const crypto_1 = __importDefault(require("crypto"));
const otp_model_1 = require("../models/otp.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_validate_1 = require("../validators/user.validate");
const loginTemp_1 = require("../utils/loginTemp");
const system_variable_1 = require("../config/system.variable");
const receipt_model_1 = require("../models/receipt.model");
class UserService {
}
exports.UserService = UserService;
_a = UserService;
UserService.preRegister = (user) => __awaiter(void 0, void 0, void 0, function* () {
    //validate user input
    const { error } = user_validate_1.preValidate.validate(user);
    if (error) {
        throw (0, errorHandler_midleware_1.newCustomError)(error.message, 422);
    }
    user.firstName = user.firstName.toLowerCase();
    user.lastName = user.lastName.toLowerCase();
    user.email = user.email.toLowerCase();
    // check if user exists
    const isFound = yield user_model_1.userModel.findOne({ email: user.email });
    // verify account state
    if ((isFound === null || isFound === void 0 ? void 0 : isFound.is_verified) === false)
        throw (0, errorHandler_midleware_1.newCustomError)("Please verify your account", 400);
    if (isFound)
        throw (0, errorHandler_midleware_1.newCustomError)("Sorry, you can not use this email", 409);
    // generate password
    const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
    if (!hashedPassword)
        throw (0, errorHandler_midleware_1.newCustomError)("Password hashing failed", 400);
    // if user  does not exist  create user
    const response = yield user_model_1.userModel.create(Object.assign(Object.assign({}, user), { password: hashedPassword, is_verified: false }));
    if (!response)
        throw (0, errorHandler_midleware_1.newCustomError)("Unable to create account", 500);
    // gen role
    if (response.role === "customer") {
        const role = yield customer_model_1.customerModel.create(Object.assign(Object.assign({}, response._id), { userId: response._id, address: response === null || response === void 0 ? void 0 : response.address }));
        if (!role) {
            throw (0, errorHandler_midleware_1.newCustomError)("Unable to create a Customer account", 500);
        }
    }
    if (response.role === "store") {
        const genStoreName = `${user.firstName.trim()}'s Store`;
        const merchantRole = store_model_1.storeModel.create(Object.assign(Object.assign({}, response._id), { userId: response._id, storeName: genStoreName, address: response.address }));
        if (!merchantRole) {
            throw (0, errorHandler_midleware_1.newCustomError)("Unable to create a Merchant account", 500);
        }
    }
    // gen otp
    const otp = yield _a.genOtp(user.email);
    if (!otp) {
        throw (0, errorHandler_midleware_1.newCustomError)("OTP generation failed", 400);
    }
    // send otp via mail
    (0, nodemailer_1.sendMail)({
        email: user.email,
        subject: "OTP VERIFICATION",
        emailInfo: {
            otp: otp.toString(),
            name: `${user.lastName} ${user.firstName}`,
        },
    }, otpTemp_1.otpTemplate);
    // send response to the user
    return "Account created Successfully. Please check your email for OTP to continue";
});
UserService.register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = user_validate_1.register.validate(user);
    if (error)
        throw (0, errorHandler_midleware_1.newCustomError)(error.message, 400);
    //check email valid
    const validUser = yield user_model_1.userModel.findOne({ email: user.email });
    if (!validUser)
        throw (0, errorHandler_midleware_1.newCustomError)("No record found", 404);
    //check if user is registered
    if (validUser.is_verified)
        throw (0, errorHandler_midleware_1.newCustomError)("Acoount already exist, Login Instead.", 409);
    //chek if Otp still exist
    const otpExist = yield otp_model_1.otpModel.findOne({ email: user.email });
    if (!otpExist)
        throw (0, errorHandler_midleware_1.newCustomError)("OTP Expired", 401);
    //check otp validity
    const otpValid = yield bcrypt_1.default.compare(user.otp.toString(), otpExist.otp);
    if (!otpValid)
        throw (0, errorHandler_midleware_1.newCustomError)("Invalid OTP", 401);
    //verify user
    const verify = yield user_model_1.userModel.findByIdAndUpdate(validUser._id, { is_verified: true }, { new: true });
    if (!verify)
        throw (0, errorHandler_midleware_1.newCustomError)("Unable to verify account", 422);
    return "Account Verified. You can now login";
});
UserService.login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = user_validate_1.login.validate({ email, password });
    if (error)
        throw (0, errorHandler_midleware_1.newCustomError)(error.message, 400);
    //check email
    const userValid = yield user_model_1.userModel.findOne({ email });
    if (!userValid)
        throw (0, errorHandler_midleware_1.newCustomError)("Invalid email", 404);
    //password validate
    const isPwdAuth = yield bcrypt_1.default.compare(password, userValid.password);
    if (!isPwdAuth)
        throw (0, errorHandler_midleware_1.newCustomError)("Invalid email/password", 401);
    //save to payload
    const payload = {
        userId: userValid._id,
        userType: userValid.role,
    };
    let jwtkey = jsonwebtoken_1.default.sign(payload, system_variable_1.jwt_secret, { expiresIn: system_variable_1.jwt_exp });
    if (!jwtkey)
        throw (0, errorHandler_midleware_1.newCustomError)("Unable to Login at this moment", 401);
    //send mail
    (0, nodemailer_1.sendMail)({
        email: email,
        subject: "Login Attempt",
        emailInfo: {
        //   ipAddress: ipAddress,
        //   userAgent: userAgent,
        },
    }, loginTemp_1.loginTemplate);
    return {
        message: "Login Successful",
        authKey: jwtkey,
    };
});
UserService.genOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = crypto_1.default.randomInt(100000, 999999);
    console.log(otp);
    //hash otp
    const hashOtp = yield bcrypt_1.default.hash(otp.toString(), 5);
    //delete old OTP
    const deleteOtp = yield otp_model_1.otpModel.findOneAndDelete({ email });
    yield otp_model_1.otpModel.create({ email, otp: hashOtp });
    return otp;
});
UserService.receiptHistory = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield store_model_1.storeModel.findById(storeId);
    // if(!store)throw newCustomError("invalid store",404)
    console.log("store", store);
    const response = yield receipt_model_1.receiptModel.find(store === null || store === void 0 ? void 0 : store._id);
    if (!response)
        throw (0, errorHandler_midleware_1.newCustomError)("No receipt found", 404);
    console.log("response", response);
    return response;
});
