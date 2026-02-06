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
exports.pdfFileNew = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
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
const pdfFileNew = (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiptNo, orderCode, customerName, customerAddress, email, items, totalAmount, storeEmail, storeName, storeAddress, paymentMethod, orderDate, storePhoneNumber, }) {
    const templatePath = path_1.default.join(__dirname, "receipt.hbs");
    const templateHtml = fs_1.default.readFileSync(templatePath, "utf8");
    const template = handlebars_1.default.compile(templateHtml);
    const preparedItems = items.map((item) => {
        const total = item.quantity * item.price;
        return Object.assign(Object.assign({}, item), { priceFormatted: item.price.toLocaleString(), lineTotal: total.toLocaleString() });
    });
    const html = template({
        receiptNo,
        orderCode,
        customerName,
        customerAddress: formatAddress(customerAddress),
        email,
        items: preparedItems,
        totalAmount: totalAmount.toLocaleString(),
        paymentMethod,
        orderDate: orderDate.toLocaleDateString(),
        storeName,
        storeEmail,
        storePhoneNumber,
        storeAddress: formatAddress(storeAddress),
    });
    // const isProduction = process.env.NODE_DEV === "production";
    const browser = yield puppeteer_1.default.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        // executablePath:
        //   process.platform === "win32"
        //     ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
        //     : "/usr/bin/chromium",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ],
        timeout: 0,
    });
    const page = yield browser.newPage();
    yield page.setContent(html, { waitUntil: "networkidle0" });
    //path
    //    : ,
    const pdfUnitArray = yield page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });
    const pdfBuffer = Buffer.from(pdfUnitArray);
    yield browser.close();
    return pdfBuffer;
});
exports.pdfFileNew = pdfFileNew;
