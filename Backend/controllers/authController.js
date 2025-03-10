// controllers/authController.js

const { body, validationResult } = require("express-validator");
const authService = require("../services/authService");
const userService = require("../services/userService");
const emailService = require("../services/emailService");
const architectService = require("../services/architectService");

// Register a new user (client or architect)
exports.register = [
  // Validation middleware
  body("email").isEmail().withMessage("Must be a valid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userData = {
        pseudo: req.body.pseudo,
        nomDeFamille: req.body.nomDeFamille,
        prenom: req.body.prenom,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        pays: req.body.pays,
        region: req.body.region,
        // Terms
        contentTerm: req.body.contentTerm || false,
        cgvAndCguTerm: req.body.cgvAndCguTerm || false,
        infoTerm: req.body.infoTerm || false,
        majorTerm: req.body.majorTerm || false,
        exterieurParticipantTerm: req.body.exterieurParticipantTerm || false,
      };

      // Add role-specific data
      if (userData.role === "architect") {
        userData.companyName = req.body.companyName;
        userData.experienceYears = req.body.experienceYears;
        userData.specialization = req.body.specialization || [];
        userData.portfolioURL = req.body.portfolioURL;
        userData.certifications = req.body.certifications || [];
        userData.education = req.body.education;
        userData.softwareProficiency = req.body.softwareProficiency || [];
        userData.location = {
          country: req.body.pays,
          region: req.body.region,
          city: req.body.city,
          coordinates: {
            type: "Point",
            coordinates: req.body.coordinates || [0, 0],
          },
        };
        userData.website = req.body.website;
        userData.socialMedia = req.body.socialMedia;
        userData.status = "pending";
      } else if (userData.role === "client") {
        userData.location = {
          country: req.body.pays,
          region: req.body.region,
          city: req.body.city,
        };
      }

      // Create user
      const { user, emailToken } = await userService.createUser(userData);

      // Send verification email
      await emailService.sendVerificationEmail(user, emailToken);

      // If architect with subscription, create subscription
      if (userData.role === "architect" && req.body.subscription) {
        await architectService.createSubscription(user._id, req.body.subscription);
      }

      res.status(201).json({
        success: true,
        message: "Compte créé, veuillez vérifier votre email.",
      });
    } catch (error) {
      next(error);
    }
  },
];

// Verify Email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    await authService.verifyEmail(token);
    
    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.authenticateUser(email, password);

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logout = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ success: false, error: "Token manquant" });
    }
    
    const token = authHeader.replace("Bearer ", "");
    await authService.logout(req.user.id, token);

    res.status(200).json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    next(error);
  }
};

// Request Password Reset
exports.requestPasswordReset = [
  body("email").isEmail().withMessage("Adresse email invalide").normalizeEmail(),
  
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { email } = req.body;
      const resetData = await authService.createPasswordResetToken(email);
      
      // If user found, send reset email
      if (resetData) {
        await emailService.sendPasswordResetEmail(resetData.user, resetData.resetToken);
      }
      
      // For security, always show the same message
      res.status(200).json({
        success: true,
        message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation",
      });
    } catch (error) {
      next(error);
    }
  }
];

// Reset Password
exports.resetPassword = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { token } = req.params;
      const { password } = req.body;
      
      await authService.resetPassword(token, password);

      res.status(200).json({
        success: true,
        message: "Votre mot de passe a été réinitialisé avec succès",
      });
    } catch (error) {
      next(error);
    }
  }
];

// Admin: Validate Architect
exports.validateArchitect = async (req, res, next) => {
  try {
    const { architectId, approved, reason } = req.body;
    
    const architect = await architectService.validateArchitect(
      architectId, 
      approved, 
      reason,
      req.user.id
    );
    
    // Send appropriate email
    await emailService.sendArchitectValidationEmail(architect, approved, reason);

    res.status(200).json({
      success: true,
      message: "Statut de l'architecte mis à jour avec succès",
    });
  } catch (error) {
    next(error);
  }
};