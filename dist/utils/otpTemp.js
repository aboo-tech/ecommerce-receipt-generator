"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpTemplate = void 0;
const otpTemplate = (data) => {
    return `<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Main Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:linear-gradient(135deg,#2e6cf7,#6a5af9); padding:30px;">
                <h2 style="color:#ffffff; margin:0; font-size:22px;">
                  One-Time-Pasword(OTP)
                </h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 30px;">
                
                <h2 style="margin-top:0; color:#333333;">
                  Hello, ${data.name}
                </h2>

                <p style="color:#555555; font-size:15px; line-height:1.6;">
                  Your One-Time Password (OTP) is:
                </p>

                <!-- OTP Box -->
                <div style="margin:30px 0; text-align:center;">
                  <div style="
                    display:inline-block;
                    padding:18px 40px;
                    font-size:28px;
                    font-weight:bold;
                    letter-spacing:6px;
                    background:#f0f4ff;
                    color:#2e6cf7;
                    border-radius:10px;
                    border:2px dashed #2e6cf7;
                  ">
                    ${data.otp}
                  </div>
                </div>

                <p style="color:#666666; font-size:14px; line-height:1.6;">
                  Please use this OTP to complete your action. It will expire shortly for your security.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f9fafc; padding:20px; font-size:12px; color:#999999;">
                © ${new Date().getFullYear()} All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
    `;
};
exports.otpTemplate = otpTemplate;
