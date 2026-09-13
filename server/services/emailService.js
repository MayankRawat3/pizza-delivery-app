import "dotenv/config";
import nodemailer from "nodemailer";


// ========================================
// SMTP TRANSPORTER
// ========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// ========================================
// CHECK SMTP CONNECTION
// ========================================

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY:", success);
  }
});


// ========================================
// VERIFY EMAIL
// ========================================

export const sendVerificationEmail = async (email, token) => {
  try {

    const verificationUrl =
      `${process.env.CLIENT_URL}/verify-email/${token}`;


   


    // ========================================
    // SEND EMAIL
    // ========================================

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,

      subject: "Verify your Pizza Delivery account",

      html: `
        <h2>Welcome to Pizza Delivery</h2>

        <p>Please verify your email address.</p>

        <a
          href="${verificationUrl}"
          style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff4d4d;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          "
        >
          Verify Email
        </a>

        <p>This link will expire in 15 minutes.</p>

        <p>
          If the button does not work, copy and paste this URL:
        </p>

        <p>
          ${verificationUrl}
        </p>
      `
    });


    // ========================================
    // EMAIL SUCCESS LOG
    // ========================================

    console.log("================================");
    console.log("EMAIL SENT SUCCESSFULLY");
    console.log("TO:", email);
    console.log("MESSAGE ID:", info.messageId);
    console.log("RESPONSE:", info.response);
    console.log("================================");


    return info;

  } catch (error) {

    console.error("================================");
    console.error("EMAIL SEND ERROR:", error);
    console.error("================================");

    throw error;
  }
};


// ========================================
// RESET PASSWORD EMAIL
// ========================================

export const sendResetPasswordEmail = async (email, token) => {
  try {

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${token}`;


    


    // ========================================
    // SEND EMAIL
    // ========================================

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,

      subject: "Reset your Pizza Delivery password",

      html: `
        <h2>Password Reset</h2>

        <p>
          Click the link below to reset your password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff4d4d;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          "
        >
          Reset Password
        </a>

        <p>
          This link will expire in 15 minutes.
        </p>

        <p>
          If the button does not work, copy and paste this URL:
        </p>

        <p>
          ${resetUrl}
        </p>
      `
    });


    // ========================================
    // EMAIL SUCCESS LOG
    // ========================================

    console.log("================================");
    console.log("RESET EMAIL SENT SUCCESSFULLY");
    console.log("TO:", email);
    console.log("MESSAGE ID:", info.messageId);
    console.log("RESPONSE:", info.response);
    console.log("================================");


    return info;

  } catch (error) {

    console.error("================================");
    console.error("RESET EMAIL SEND ERROR:", error);
    console.error("================================");

    throw error;
  }
};


// ==========================================
// SEND LOW STOCK ALERT EMAIL
// ==========================================

export const sendLowStockAlertEmail = async (
  adminEmail,
  lowStockItems
) => {
  try {
    if (
      !adminEmail ||
      !Array.isArray(lowStockItems) ||
      lowStockItems.length === 0
    ) {
      return;
    }

    const itemsHtml = lowStockItems
      .map(
        (item) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">
              ${item.name}
            </td>

            <td style="padding: 10px; border: 1px solid #ddd;">
              ${item.category}
            </td>

            <td style="padding: 10px; border: 1px solid #ddd;">
              ${item.quantity}
            </td>

            <td style="padding: 10px; border: 1px solid #ddd;">
              ${item.threshold}
            </td>

            <td style="padding: 10px; border: 1px solid #ddd;">
              ${item.unit}
            </td>
          </tr>
        `
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: "⚠️ Low Stock Alert - Pizza Delivery App",

      html: `
        <div style="font-family: Arial, sans-serif;">

          <h2>⚠️ Low Stock Alert</h2>

          <p>
            The following inventory items have reached
            or fallen below their stock threshold:
          </p>

          <table
            style="
              border-collapse: collapse;
              width: 100%;
              max-width: 700px;
            "
          >

            <thead>
              <tr>
                <th style="padding: 10px; border: 1px solid #ddd;">
                  Item
                </th>

                <th style="padding: 10px; border: 1px solid #ddd;">
                  Category
                </th>

                <th style="padding: 10px; border: 1px solid #ddd;">
                  Current Stock
                </th>

                <th style="padding: 10px; border: 1px solid #ddd;">
                  Threshold
                </th>

                <th style="padding: 10px; border: 1px solid #ddd;">
                  Unit
                </th>
              </tr>
            </thead>

            <tbody>
              ${itemsHtml}
            </tbody>

          </table>

          <p style="margin-top: 20px;">
            Please restock these items as soon as possible.
          </p>

        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      "LOW STOCK ALERT EMAIL SENT:",
      info.messageId
    );

  } catch (error) {
    console.error(
      "LOW STOCK EMAIL ERROR:",
      error
    );

    throw error;
  }
};