// services/emailService.js

const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Send verification email
   * @param {Object} user - User object
   * @param {string} emailToken - Verification token
   * @returns {Promise} Email sending promise
   */
  async sendVerificationEmail(user, emailToken) {
    const confirmUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;

    return this.transporter.sendMail({
      to: user.email,
      subject: "Vérification de votre email",
      html: this.getVerificationEmailTemplate(user.prenom, confirmUrl),
    });
  }

  /**
   * Send password reset email
   * @param {Object} user - User object
   * @param {string} resetToken - Reset token
   * @returns {Promise} Email sending promise
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    return this.transporter.sendMail({
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: this.getPasswordResetEmailTemplate(user.prenom, resetUrl),
    });
  }

  /**
   * Send architect validation email
   * @param {Object} architect - Architect user
   * @param {boolean} approved - Whether approved or rejected
   * @param {string} reason - Rejection reason if applicable
   * @returns {Promise} Email sending promise
   */
  async sendArchitectValidationEmail(architect, approved, reason) {
    if (approved) {
      return this.transporter.sendMail({
        to: architect.email,
        subject: "Validation de votre compte",
        html: this.getArchitectApprovalTemplate(architect.prenom),
      });
    } else {
      return this.transporter.sendMail({
        to: architect.email,
        subject: "Rejet de votre inscription",
        html: this.getArchitectRejectionTemplate(architect.prenom, reason),
      });
    }
  }

  // Email templates
  getVerificationEmailTemplate(firstName, confirmUrl) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Vérification de votre email</h2>
        <p>Bonjour ${firstName},</p>
        <p>Merci pour votre inscription. Veuillez cliquer sur le lien ci-dessous pour confirmer votre email :</p>
        <p style="margin: 20px 0;">
          <a href="${confirmUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Vérifier mon email
          </a>
        </p>
        <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur : ${confirmUrl}</p>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous rencontrez des problèmes, veuillez contacter notre support.</p>
      </div>
    `;
  }

  getPasswordResetEmailTemplate(firstName, resetUrl) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Réinitialisation de votre mot de passe</h2>
        <p>Bonjour ${firstName},</p>
        <p>Vous avez demandé une réinitialisation de mot de passe. Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur : ${resetUrl}</p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
      </div>
    `;
  }

  getArchitectApprovalTemplate(firstName) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Félicitations !</h2>
        <p>Bonjour ${firstName},</p>
        <p>Votre compte a été validé par l'administration. Vous pouvez maintenant vous connecter et utiliser toutes les fonctionnalités de la plateforme.</p>
      </div>
    `;
  }

  getArchitectRejectionTemplate(firstName, reason) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Statut de votre inscription</h2>
        <p>Bonjour ${firstName},</p>
        <p>Nous regrettons de vous informer que votre inscription a été rejetée pour la raison suivante :</p>
        <p style="padding: 10px; background-color: #f8f8f8; border-left: 4px solid #e74c3c;">${reason}</p>
        <p>Vous pouvez contacter notre support si vous avez des questions.</p>
      </div>
    `;
  }
}

module.exports = new EmailService();
