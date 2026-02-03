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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPdf = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const system_variable_1 = require("../config/system.variable");
let configOptions = {
    host: "1.2.3.4",
    port: 465,
    secure: true,
    tls: {
        // must provide server name, otherwise TLS certificate check will fail
        servername: "example.com",
    },
};
const formatAddress = (address) => {
    var _a, _b, _c, _d;
    if (!address)
        return "";
    return `
    ${address.label ? `<div style="font-weight: 600; margin-bottom: 4px;">(${address.label})</div>` : ""}
    ${address.street ? `<div>${address.street}</div>` : ""}
    ${address.city || address.state ? `<div>${(_a = address.city) !== null && _a !== void 0 ? _a : ""}${address.city && address.state ? ", " : ""}${(_b = address.state) !== null && _b !== void 0 ? _b : ""}</div>` : ""}
    ${address.country || address.postalCode ? `<div>${(_c = address.country) !== null && _c !== void 0 ? _c : ""} ${(_d = address.postalCode) !== null && _d !== void 0 ? _d : ""}</div>` : ""}
  `;
};
const sendPdf = (data, attachmentBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const sender = "thetechbrocode@gmail.com";
        const transporter = nodemailer_1.default.createTransport({
            host: sender,
            //   port: 587,
            service: "gmail",
            secure: true,
            auth: {
                user: sender,
                pass: system_variable_1.app_password,
            },
        });
        const message = {
            from: sender,
            to: data.email,
            subject: data.subject,
            html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background-color: #e60808; color: #ffffff; padding: 20px 24px;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600;">
                Order Confirmation
              </h2>
            </div>

            <!-- Body -->
            <div style="padding: 24px; color: #334155; font-size: 14px; line-height: 1.6;">
              <p style="margin: 0 0 12px 0;">
                Hello <strong>${(_a = data.emailInfo.customerName) !== null && _a !== void 0 ? _a : "Customer"}</strong>,
              </p>

              <p style="margin: 0 0 12px 0;">
                Thank you for your purchase! Your order has been successfully received.
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0 0 6px 0;">
                  <strong>Order ID:</strong> ${(_b = data.emailInfo.orderCode) !== null && _b !== void 0 ? _b : "N/A"}
                </p>
                <p style="margin: 0 0 6px 0;">
                  <strong>Payment Method:</strong> ${(_c = data.emailInfo.paymentMethod) !== null && _c !== void 0 ? _c : "N/A"}
                </p>
                <p style="margin: 0 0 6px 0;">
                  <strong>Order Date:</strong> ${new Date(data.emailInfo.orderDate).toLocaleString()}
                </p>
              </div>

              <p style="margin: 0 0 12px 0;">
                A detailed receipt is attached to this email for your records.
              </p>

              <p style="margin: 0;">
                If you have any questions, feel free to contact us.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 16px 24px; color: #64748b; font-size: 12px;">
              <p style="margin: 0 0 6px 0;">
                <strong>${(_d = data.emailInfo.storeName) !== null && _d !== void 0 ? _d : "Our Store"}</strong>
              </p>
              <p style="margin: 0 0 4px 0;">
                ${(_e = formatAddress(data.emailInfo.storeAddress)) !== null && _e !== void 0 ? _e : ""}
              </p>
              <p style="margin: 0;">
                Phone: ${(_f = data.emailInfo.storePhoneNumber) !== null && _f !== void 0 ? _f : "N/A"}
              </p>
            </div>

          </div>
        </div>
    
      `,
            attachments: attachmentBuffer
                ? [
                    {
                        filename: "receipt.pdf",
                        content: attachmentBuffer,
                        contentType: "application/pdf",
                    },
                ]
                : [],
        };
        yield transporter.sendMail(message);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendPdf = sendPdf;
