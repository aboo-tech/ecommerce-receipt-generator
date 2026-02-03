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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const system_variable_1 = require("../config/system.variable");
cloudinary_1.v2.config({
    cloud_name: system_variable_1.cloud_name,
    api_key: system_variable_1.api_key,
    api_secret: system_variable_1.api_secret,
});
const uploadCloudinary = (pdfBuffer, receiptId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                resource_type: "raw",
                folder: "receipts",
                public_id: `receipt${receiptId}`,
                format: "pdf",
                overwrite: true,
            }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result)
                    return reject(new Error("No secure_url from Cloudinary"));
                resolve(result);
            });
            uploadStream.end(pdfBuffer);
        });
        if (!(result === null || result === void 0 ? void 0 : result.secure_url)) {
            throw new Error("No secure_url from cloudinary");
        }
        return result.secure_url;
    }
    catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw error; // 👈 THIS fixes the T
    }
});
exports.uploadCloudinary = uploadCloudinary;
