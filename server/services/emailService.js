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
    // VERIFICATION DEBUG
    // ========================================

    console.log("================================");
    console.log("VERIFICATION EMAIL DEBUG");
    console.log("EMAIL:", email);
    console.log("TOKEN:", token);
    console.log("TOKEN LENGTH:", token?.length);
    console.log("CLIENT URL:", process.env.CLIENT_URL);
    console.log("VERIFICATION URL:", verificationUrl);
    console.log("================================");


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
    // RESET PASSWORD DEBUG
    // ========================================

    console.log("================================");
    console.log("RESET PASSWORD EMAIL DEBUG");
    console.log("EMAIL:", email);
    console.log("TOKEN:", token);
    console.log("TOKEN LENGTH:", token?.length);
    console.log("CLIENT URL:", process.env.CLIENT_URL);
    console.log("RESET URL:", resetUrl);
    console.log("================================");


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