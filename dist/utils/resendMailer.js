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
exports.sendEmail = void 0;
const resend_1 = require("resend");
const system_variable_1 = require("../config/system.variable");
const resend = new resend_1.Resend(system_variable_1.resend_api_key);
const sendEmail = (data, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield resend.emails.send({
            from: system_variable_1.resend_email, // change to your domain later
            to: data.email,
            subject: data.subject,
            html: cb(data.emailInfo),
        });
        console.log("Email sent");
    }
    catch (error) {
        console.error("Email error:", error);
    }
});
exports.sendEmail = sendEmail;
