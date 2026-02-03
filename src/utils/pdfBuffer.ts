import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { chrome_path } from "../config/system.variable";

type Address = {
  label?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  phoneNumber?: string | null;
};
type ReceiptItem = {
  productName: string;
  quantity: number;
  price: number;
  total: number;
};
const formatAddress = (address: Address | null | undefined) => {
  if (!address) return "";

  return `
    ${address.label ? `<div style="font-weight: 600; margin-bottom: 4px;">(${address.label})</div>` : ""}
    ${address.street ? `<div>${address.street}</div>` : ""}
    ${address.city || address.state ? `<div>${address.city ?? ""}${address.city && address.state ? ", " : ""}${address.state ?? ""}</div>` : ""}
    ${address.country || address.postalCode ? `<div>${address.country ?? ""} ${address.postalCode ?? ""}</div>` : ""}
  `;
};

export const pdfFileNew = async ({
  receiptNo,
  orderCode,
  customerName,
  customerAddress,
  email,
  items,
  totalAmount,
  storeEmail,
  storeName,
  storeAddress,
  paymentMethod,
  orderDate,
  storePhoneNumber,
}: {
  receiptNo: string;
  orderCode: string;
  customerName: string;
  customerAddress: Address | null;
  email: string;
  items: ReceiptItem[];
  totalAmount: number;
  paymentMethod: string;
  orderDate: Date;
  storeName: string;
  storeEmail: string;
  storePhoneNumber: string;
  storeAddress: Address | null;
}): Promise<Buffer> => {
  const templatePath = path.join(__dirname, "receipt.hbs");
  const templateHtml = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateHtml);

  const preparedItems = items.map((item) => {
    const total = item.quantity * item.price;
    return {
      ...item,
      priceFormatted: item.price.toLocaleString(),
      lineTotal: total.toLocaleString(),
    };
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
  const isProduction = process.env.NODE_DEV === "production";
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: isProduction
      ? chrome_path
      : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    timeout: 0,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfUnitArray = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", bottom: "20mm", left: "15mm", right: "15mm" },
  });

  const pdfBuffer = Buffer.from(pdfUnitArray);
  await browser.close();

  return pdfBuffer;
};
