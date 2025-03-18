const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create the transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register a new user (client or architect)
exports.register = async (req, res) => {
  try {
    const {
      pseudo,
      nomDeFamille,
      prenom,
      email,
      password,
      phoneNumber,
      role,
      // Common location fields
      pays,
      region,
      city,
      // Architect specific fields
      cin,
      patenteNumber,
      companyName,
      experienceYears,
      specialization,
      portfolioURL,
      certifications,
      education,
      softwareProficiency,
      coordinates,
      website,
      socialMedia,
      subscription,
    } = req.body;

    // Check if the email is already used
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Validate required fields based on role
    if (role === "architect") {
      if (!cin || !patenteNumber) {
        return res.status(400).json({
          error: "CIN and Patente Number are required for architects.",
        });
      }
      if (!password || password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long." });
      }
    } else if (role === "client") {
      if (!pays || !region) {
        return res
          .status(400)
          .json({ error: "Country and region are required for clients." });
      }
    }

    // Create base user data
    const userData = {
      pseudo,
      nomDeFamille,
      prenom,
      email,
      password, // Will be hashed by pre-save hook
      phoneNumber,
      role,
      location: {
        country: pays,
        region: region,
        city: city,
      },
      // Terms
      contentTerm: req.body.contentTerm || false,
      cgvAndCguTerm: req.body.cgvAndCguTerm || false,
      infoTerm: req.body.infoTerm || false,
      majorTerm: req.body.majorTerm || false,
      exterieurParticipantTerm: req.body.exterieurParticipantTerm || false,
    };

    // Add architect-specific fields
    if (role === "architect") {
      userData.cin = cin;
      userData.patenteNumber = patenteNumber;
      userData.companyName = companyName;
      userData.experienceYears = experienceYears;
      userData.specialization = specialization || [];
      userData.portfolioURL = portfolioURL;
      userData.certifications = certifications || [];
      userData.education = education;
      userData.softwareProficiency = softwareProficiency || [];
      userData.website = website;
      userData.socialMedia = socialMedia;
      userData.status = "pending";
      userData.emailVerified = false;
      userData.location = {
        country: pays,
        region: region,
        city: city,
        coordinates: {
          type: "Point",
          coordinates: coordinates || [0, 0], // Default if not provided
        },
      };
    }

    // Create and save the user
    const user = new User(userData);
    await user.save();

    // Generate email verification token
    const emailToken = crypto.randomBytes(32).toString("hex");
    user.emailToken = emailToken;

    // Create verification URL
    const confirmUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;

    // Send verification email
    await transporter.sendMail({
      to: user.email,
      subject: "Vérification de votre email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Vérification de votre email</h2>
          <p>Bonjour ${user.prenom},</p>
          <p>Merci pour votre inscription. Veuillez cliquer sur le lien ci-dessous pour confirmer votre email :</p>
          <p style="margin: 20px 0;">
            <a href="${confirmUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
              Vérifier mon email
            </a>
          </p>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur : ${confirmUrl}</p>
          <p>Ce lien expirera dans 24 heures.</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Compte créé, veuillez vérifier votre email.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Vérifier le token Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extraire les données de l'utilisateur
    const { email, name, picture } = ticket.getPayload();

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });

    if (!user) {
      // Si l'utilisateur n'existe pas, on le crée
      user = new User({ name, email, avatar: picture, role: "client" });
      await user.save();
    }

    // Générer un JWT
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ user, token: jwtToken });
  } catch (error) {
    console.error("Erreur Google login:", error);
    res.status(400).json({ error: "Jeton Google invalide" });
  }
};
// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailToken: token });
    if (!user) {
      return res.status(400).json({ success: false, error: "Lien invalide" });
    }

    user.isVerified = true;
    user.emailToken = undefined; // Remove the token after verification
    await user.save();

    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Email ou mot de passe incorrect" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Email ou mot de passe incorrect" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error: "Veuillez vérifier votre email avant de vous connecter",
        emailVerification: true,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store token in user's authTokens array
    user.authTokens = user.authTokens || [];
    user.authTokens.push({ token });
    await user.save();

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.authTokens;

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user: userObject,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, error: "Erreur lors de la connexion" });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    // User is already attached by auth middleware
    const user = await User.findById(req.user.id).select(
      "-password -authTokens"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé" });
    }

    // Remove the token from authTokens array
    user.authTokens = user.authTokens.filter(
      (tokenObj) => tokenObj.token !== token
    );
    await user.save();

    res.status(200).json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Aucun compte associé à cet email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send reset email
    await transporter.sendMail({
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Réinitialisation de votre mot de passe</h2>
          <p>Bonjour ${user.prenom},</p>
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
      `,
    });

    res.status(200).json({
      success: true,
      message:
        "Un email de réinitialisation a été envoyé à votre adresse email",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Le lien de réinitialisation est invalide ou a expiré",
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Votre mot de passe a été réinitialisé avec succès",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin: Validate Architect
exports.validateArchitect = async (req, res) => {
  try {
    const { architectId, approved, reason } = req.body;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Seuls les administrateurs peuvent valider les architectes",
      });
    }

    const architect = await User.findOne({
      _id: architectId,
      role: "architect",
    });
    if (!architect) {
      return res
        .status(404)
        .json({ success: false, error: "Architecte non trouvé" });
    }

    if (approved) {
      architect.status = "approved";
      await transporter.sendMail({
        to: architect.email,
        subject: "Validation de votre compte",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Félicitations !</h2>
            <p>Bonjour ${architect.prenom},</p>
            <p>Votre compte a été validé par l'administration. Vous pouvez maintenant vous connecter et utiliser toutes les fonctionnalités de la plateforme.</p>
          </div>
        `,
      });
    } else {
      architect.status = "rejected";
      await transporter.sendMail({
        to: architect.email,
        subject: "Rejet de votre inscription",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Statut de votre inscription</h2>
            <p>Bonjour ${architect.prenom},</p>
            <p>Nous regrettons de vous informer que votre inscription a été rejetée pour la raison suivante :</p>
            <p style="padding: 10px; background-color: #f8f8f8; border-left: 4px solid #e74c3c;">${reason}</p>
            <p>Vous pouvez contacter notre support si vous avez des questions.</p>
          </div>
        `,
      });
    }

    await architect.save();

    res.status(200).json({
      success: true,
      message: "Statut de l'architecte mis à jour avec succès",
    });
  } catch (error) {
    console.error("Validate architect error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
