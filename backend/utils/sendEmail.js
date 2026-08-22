const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, name, code) => {
  await transporter.sendMail({
    from: `"VendorVerse" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "VendorVerse Email Verification Code",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 12px;
      ">

        <h2 style="color: #667eea;">
          Welcome to VendorVerse, ${name}! 🎉
        </h2>

        <p>
          Thank you for creating your VendorVerse account.
        </p>

        <p>
          Please use the following verification code:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          text-align: center;
          padding: 20px;
          background: #f4f4f8;
          border-radius: 10px;
          margin: 20px 0;
        ">
          ${code}
        </div>

        <p>
          This code will expire in <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not create this account, you can safely ignore this email.
        </p>

        <hr />

        <p style="color: #777;">
          VendorVerse — Your Virtual Marketplace
        </p>

      </div>
    `,
  });
};

module.exports = sendVerificationEmail;