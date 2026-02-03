import nodemailer from "nodemailer";
import { admin_email, app_password } from "../config/system.variable";
let configOptions = {
  host: "1.2.3.4",
  port: 465,
  secure: true,
  tls: {
    // must provide server name, otherwise TLS certificate check will fail
    servername: "example.com",
  },
};

export const sendMail = async (
  data: { email: string; subject: string; emailInfo: any },
  cb: Function,
) => {
  try {
    const sender = admin_email;
    const transporter = nodemailer.createTransport({
      host: sender,
      service: "gmail",
      secure: true,
      auth: {
        user: sender,
        pass: app_password,
      },
    });

    const message = {
      from: sender,
      to: data.email,
      subject: data.subject,
      html: cb(data.emailInfo),
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};
