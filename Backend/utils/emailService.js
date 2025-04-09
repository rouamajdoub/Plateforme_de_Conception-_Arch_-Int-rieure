// utils/emailService.js
const nodemailer = require("nodemailer");

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to send approval email
const sendApprovalEmail = async (user) => {
  try {
    // Use the already created transporter - don't create a new one
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your Architect Account Has Been Approved",
      html: `
        <h1>Welcome to Our Platform!</h1>
        <p>Dear ${user.firstName || user.prenom || "Architect"},</p>
        <p>We're pleased to inform you that your architect account has been approved.</p>
        <p>You can now log in to the platform using your registered email and password.</p>
        <p>Here's a summary of your account information:</p>
        <ul>
          <li>Name: ${user.firstName || user.prenom} ${
        user.lastName || user.nomDeFamille
      }</li>
          <li>Email: ${user.email}</li>
          <li>Role: Architect</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Thank you for joining us!</p>
      `,
    };

    console.log(`Attempting to send email to: ${user.email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("Approval email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
};

module.exports = {
  sendApprovalEmail,
};
