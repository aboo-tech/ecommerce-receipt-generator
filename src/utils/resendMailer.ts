import { Resend } from "resend";
import { resend_api_key, resend_email } from "../config/system.variable";

const resend = new Resend(resend_api_key);

export const sendEmail = async (
  data: { email: string; subject: string; emailInfo: any },
  cb: Function,
) => {
  try {
    const response = await resend.emails.send({
      from: resend_email, // change to your domain later
      to: data.email,
      subject: data.subject,
      html: cb(data.emailInfo),
    });

    console.log("Email sent");
  } catch (error) {
    console.error("Email error:", error);
  }
};
