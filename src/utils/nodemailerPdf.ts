import { application } from "express";
import nodemailer from "nodemailer";
let configOptions = {
  host: "1.2.3.4",
  port: 465,
  secure: true,
  tls: {
    // must provide server name, otherwise TLS certificate check will fail
    servername: "example.com",
  },
};

type Address = {
  label?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  phoneNumber?: string | null;
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

export const sendPdf = async (
  data: { email: string; subject: string; emailInfo: any },
  attachmentBuffer?: Buffer,
) => {
  try {
    const sender = "thetechbrocode@gmail.com";
    const transporter = nodemailer.createTransport({
      host: sender,
      //   port: 587,
      service: "gmail",
      secure: true,
      auth: {
        user: sender,
        pass: "mkqe gpgq zlcy wbkt",
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
                Hello <strong>${data.emailInfo.customerName ?? "Customer"}</strong>,
              </p>

              <p style="margin: 0 0 12px 0;">
                Thank you for your purchase! Your order has been successfully received.
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0 0 6px 0;">
                  <strong>Order ID:</strong> ${data.emailInfo.orderCode ?? "N/A"}
                </p>
                <p style="margin: 0 0 6px 0;">
                  <strong>Payment Method:</strong> ${data.emailInfo.paymentMethod ?? "N/A"}
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
                <strong>${data.emailInfo.storeName ?? "Our Store"}</strong>
              </p>
              <p style="margin: 0 0 4px 0;">
                ${formatAddress(data.emailInfo.storeAddress) ?? ""}
              </p>
              <p style="margin: 0;">
                Phone: ${data.emailInfo.storePhoneNumber ?? "N/A"}
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

    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};
