// utils/emailService.js
const SibApiV3Sdk = require("sib-api-v3-sdk");

//  Brevo API client
const initBrevoClient = () => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  return new SibApiV3Sdk.TransactionalEmailsApi();
};

// Function to send approval email to architects
const sendApprovalEmail = async (user) => {
  try {
    const apiInstance = initBrevoClient();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: process.env.EMAIL_USER,
      name: "Visiona",
    };

    sendSmtpEmail.to = [{ email: user.email }];
    sendSmtpEmail.subject = "Your Architect Account Has Been Approved";
    sendSmtpEmail.htmlContent = `
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
    `;

    console.log(`Attempting to send approval email to: ${user.email}`);
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Approval email sent successfully:", result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
};

// Function to send rejection email to architects
const sendRejectionEmail = async (user) => {
  try {
    const apiInstance = initBrevoClient();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Format rejection reason
    let reasonText = "";
    if (user.rejectionDetails && user.rejectionDetails.reason) {
      reasonText = user.rejectionDetails.reason;
      if (
        user.rejectionDetails.reason === "Other" &&
        user.rejectionDetails.customReason
      ) {
        reasonText += `: ${user.rejectionDetails.customReason}`;
      } else if (user.rejectionDetails.customReason) {
        reasonText += `\nAdditional information: ${user.rejectionDetails.customReason}`;
      }
    }

    sendSmtpEmail.sender = {
      email: process.env.EMAIL_USER,
      name: "Visiona",
    };

    sendSmtpEmail.to = [{ email: user.email }];
    sendSmtpEmail.subject = "Your Architect Account Application Status";
    sendSmtpEmail.htmlContent = `
      <h1>Architect Account Application Update</h1>
      <p>Dear ${user.firstName || user.prenom || "Architect"},</p>
      <p>Thank you for your interest in joining our platform as an architect.</p>
      <p>After careful review of your application, we regret to inform you that we are unable to approve your account at this time.</p>
      ${reasonText ? `<p><strong>Reason:</strong> ${reasonText}</p>` : ""}
      <p>You may address the issues mentioned above and submit a new application in the future.</p>
      <p>If you believe there has been an error or would like to provide additional information, please contact our support team.</p>
      <p>Thank you for your understanding.</p>
    `;

    console.log(`Attempting to send rejection email to: ${user.email}`);
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Rejection email sent successfully:", result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
};

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
};
