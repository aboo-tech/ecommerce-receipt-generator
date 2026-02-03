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
exports.sendMail = void 0;
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
const sendMail = (data, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = system_variable_1.admin_email;
        const transporter = nodemailer_1.default.createTransport({
            host: sender,
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
            html: cb(data.emailInfo),
        };
        yield transporter.sendMail(message);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendMail = sendMail;
