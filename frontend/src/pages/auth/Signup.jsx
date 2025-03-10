import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import SubscriptionPlans from "../../components/subs/SubscriptionPlans";
import "../../styles/Auth.css";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  // Form data state
  const [formData, setFormData] = useState({
    role: "",
    pseudo: "",
    nomDeFamille: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    pays: "",
    region: "",
    city: "",
    // Terms
    contentTerm: false,
    cgvAndCguTerm: false,
    infoTerm: false,
    majorTerm: false,
    exterieurParticipantTerm: false,
    // Architect specific fields
    companyName: "",
    experienceYears: "",
    specialization: [],
    portfolioURL: "",
    certifications: [],
    education: {
      degree: "",
      institution: "",
      graduationYear: ""
    },
    softwareProficiency: [],
    coordinates: [0, 0],
    website: "",
    socialMedia: {
      linkedin: "",
      instagram: ""
    },
    subscription: null
  });

  // Validation state
  const [validation, setValidation] = useState({
    passwordMatch: true,
    emailValid: true,
    termsAccepted: true
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    // Validate password match
    if (name === "password" || name === "confirmPassword") {
      const otherField = name === "password" ? "confirmPassword" : "password";
      setValidation((prev) => ({
        ...prev,
        passwordMatch: !formData[otherField] || value === formData[otherField]
      }));
    }

    // Validate email
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidation((prev) => ({
        ...prev,
        emailValid: emailRegex.test(value)
      }));
    }
  };

  // Handle array/object fields
  const handleSpecializationChange = (e) => {
    const value = e.target.value.trim();
    if (value && !formData.specialization.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        specialization: [...prev.specialization, value]
      }));
      e.target.value = ""; // Clear input after adding
    }
  };

  const handleCertificationChange = (e) => {
    const value = e.target.value.trim();
    if (value && !formData.certifications.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, value]
      }));
      e.target.value = ""; // Clear input after adding
    }
  };

  const handleSoftwareChange = (e) => {
    e.preventDefault();
    const name = document.getElementById("softwareName").value.trim();
    const level = document.getElementById("softwareLevel").value;
    
    if (name) {
      setFormData((prev) => ({
        ...prev,
        softwareProficiency: [
          ...prev.softwareProficiency,
          { name, level }
        ]
      }));
      
      // Clear inputs
      document.getElementById("softwareName").value = "";
      document.getElementById("softwareLevel").value = ""; // Clear level
    }
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value
      }
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  const handleCoordinatesChange = (index, value) => {
    const newCoordinates = [...formData.coordinates];
    newCoordinates[index] = parseFloat(value) || 0;
    
    setFormData((prev) => ({
      ...prev,
      coordinates: newCoordinates
    }));
  };

  // Handle subscription selection
  const handleSubscriptionSelect = (subscriptionPlan) => {
    setFormData((prev) => ({
      ...prev,
      subscription: subscriptionPlan
    }));
    setStep(4); // Move to confirmation step
  };

  // Navigation between steps
  const handleNextStep = () => {
    // Validation for Step 1
    if (step === 1 && !formData.role) {
      setError("Veuillez sélectionner un rôle");
      return;
    }
    
    // Validation for Step 2
    if (step === 2) {
      // Check required fields
      const requiredFields = ["pseudo", "nomDeFamille", "prenom", "email", "password", "confirmPassword"];
      
      // Add architect-specific required fields
      if (formData.role === "architect") {
        requiredFields.push("companyName", "experienceYears", "pays", "region");
      } else if (formData.role === "client") {
        requiredFields.push("pays", "region");
      }
      
      for (const field of requiredFields) {
        if (!formData[field]) {
          setError(`Le champ ${field} est requis`);
          return;
        }
      }
      
      // Password match validation
      if (formData.password !== formData.confirmPassword) {
        setValidation((prev) => ({
          ...prev,
          passwordMatch: false
        }));
        setError("Les mots de passe ne correspondent pas");
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setValidation((prev) => ({
          ...prev,
          emailValid: false
        }));
        setError("Adresse email invalide");
        return;
      }
      
      // Terms validation
      if (formData.role === "architect" && !(
        formData.contentTerm && 
        formData.cgvAndCguTerm && 
        formData.majorTerm
      )) {
        setValidation((prev) => ({
          ...prev,
          termsAccepted: false
        }));
        setError("Vous devez accepter les conditions générales");
        return;
      }
    }
    
    // If all validations pass, proceed to next step
    setError(null);
    setStep(step + 1);
    
    // Skip subscription step for clients
    if (step === 2 && formData.role === "client") {
      setStep(4); // Skip to confirmation
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Final validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }
      
      // Prepare data for API
      const userData = {
        role: formData.role,
        pseudo: formData.pseudo,
        nomDeFamille: formData.nomDeFamille,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        pays: formData.pays,
        region: formData.region,
        city: formData.city,
        contentTerm: formData.contentTerm,
        cgvAndCguTerm: formData.cgvAndCguTerm,
        infoTerm: formData.infoTerm,
        majorTerm: formData.majorTerm,
        exterieurParticipantTerm: formData.exterieurParticipantTerm
      };
      
      // Add architect-specific fields
      if (formData.role === "architect") {
        userData.companyName = formData.companyName;
        userData.experienceYears = formData.experienceYears;
        userData.specialization = formData.specialization;
        userData.portfolioURL = formData.portfolioURL;
        userData.certifications = formData.certifications;
        userData.education = formData.education;
        userData.softwareProficiency = formData.softwareProficiency;
        userData.coordinates = formData.coordinates;
        userData.website = formData.website;
        userData.socialMedia = formData.socialMedia;
        userData.subscription = formData.subscription;
      }
      
      // Dispatch to Redux action
      const resultAction = await dispatch(registerUser(userData));
      
      if (registerUser.fulfilled.match(resultAction)) {
        // Registration successful
        setLoading(false);
        navigate("/verification-sent");
      } else {
        // Registration failed
        throw new Error(resultAction.payload || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  // Reset errors when changing steps
  useEffect(() => {
    setError(null);
  }, [step]);

  // Render the current step
  return (
    <div className="signup-wrapper">
      <h1>Inscription</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="step-indicator">
        <div className={`step-dot ${step >= 1 ? "active" : ""}`}>1</div>
        <div className="step-line"></div>
        <div className={`step-dot ${step >= 2 ? "active" : ""}`}>2</div>
        <div className="step-line"></div>
        <div className={`step-dot ${step >= 3 ? "active" : ""}`}>3</div>
        <div className="step-line"></div>
        <div className={`step-dot ${step >= 4 ? "active" : ""}`}>4</div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="step role-selection">
            <h2>Choisissez votre rôle</h2>
            <div className="role-options">
              <div 
                className={`role-card ${formData.role === "client" ? "selected" : ""}`}
                onClick={() => setFormData(prev => ({ ...prev, role: "client" }))}
              >
                <h3>Client</h3>
                <p>Je cherche un architecte pour mon projet</p>
              </div>
              <div 
                className={`role-card ${formData.role === "architect" ? "selected" : ""}`}
                onClick={() => setFormData(prev => ({ ...prev, role: "architect" }))}
              >
                <h3>Architecte</h3>
                <p>Je souhaite proposer mes services sur la plateforme</p>
              </div>
            </div>
            <button 
              type="button" 
              className="next-btn"
              onClick={handleNextStep}
            >
              Continuer
            </button>
          </div>
        )}
        
        {/* Step 2: Personal Information */}
        {step === 2 && (
          <div className="step personal-info">
            <h2>Informations personnelles</h2>
            
            <div className="form-group">
              <label htmlFor="pseudo">Pseudo *</label>
              <input
                type="text"
                id="pseudo"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nomDeFamille">Nom *</label>
                <input
                  type="text"
                  id="nomDeFamille"
                  name="nomDeFamille"
                  value={formData.nomDeFamille}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="prenom">Prénom *</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={!validation.emailValid ? "invalid" : ""}
                required
              />
              {!validation.emailValid && (
                <span className="validation-error">Email invalide</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={!validation.passwordMatch ? "invalid" : ""}
                required
              />
              {!validation.passwordMatch && (
                <span className="validation-error">Les mots de passe ne correspondent pas</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Numéro de téléphone</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pays">Pays *</label>
              <input
                type="text"
                id="pays"
                name="pays"
                value={formData.pays}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="region">Région *</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">Ville *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="terms-conditions">
              <label>
                <input
                  type="checkbox"
                  name="contentTerm"
                  checked={formData.contentTerm}
                  onChange={handleChange}
                />
                J'accepte les conditions générales
              </label>
              <label>
                <input
                  type="checkbox"
                  name="cgvAndCguTerm"
                  checked={formData.cgvAndCguTerm}
                  onChange={handleChange}
                />
                J'accepte les CGV et CGU
              </label>
              <label>
                <input
                  type="checkbox"
                  name="majorTerm"
                  checked={formData.majorTerm}
                  onChange={handleChange}
                />
                J'ai plus de 18 ans
              </label>
              {!validation.termsAccepted && (
                <span className="validation-error">Vous devez accepter les conditions</span>
              )}
            </div>

            <button 
              type="button" 
              className="next-btn"
              onClick={handleNextStep}
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 3: Architect Specific Fields */}
        {step === 3 && formData.role === "architect" && (
          <div className="step architect-info">
            <h2>Informations de l'architecte</h2>

            <div className="form-group">
              <label htmlFor="companyName">Nom de l'entreprise *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="experienceYears">Années d'expérience *</label>
              <input
                type="number"
                id="experienceYears"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolioURL">URL du portfolio</label>
              <input
                type="url"
                id="portfolioURL"
                name="portfolioURL"
                value={formData.portfolioURL}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Spécialisation (ajoutez une spécialisation)</label>
              <input
                type="text"
                onChange={handleSpecializationChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="certifications">Certifications (ajoutez une certification)</label>
              <input
                type="text"
                onChange={handleCertificationChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="education">Éducation</label>
              <input
                type="text"
                name="degree"
                placeholder="Diplôme"
                value={formData.education.degree}
                onChange={handleEducationChange}
              />
              <input
                type="text"
                name="institution"
                placeholder="Institution"
                value={formData.education.institution}
                onChange={handleEducationChange}
              />
              <input
                type="text"
                name="graduationYear"
                placeholder="Année de graduation"
                value={formData.education.graduationYear}
                onChange={handleEducationChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Site web</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="socialMedia">Réseaux sociaux</label>
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn"
                value={formData.socialMedia.linkedin}
                onChange={handleSocialMediaChange}
              />
              <input
                type="text"
                name="instagram"
                placeholder="Instagram"
                value={formData.socialMedia.instagram}
                onChange={handleSocialMediaChange}
              />
            </div>

            <div className="form-group coordinates">
              <h4>Coordonnées (Latitude, Longitude)</h4>
              <input
                type="text"
                placeholder="Latitude"
                value={formData.coordinates[0]}
                onChange={(e) => handleCoordinatesChange(0, e.target.value)}
              />
              <input
                type="text"
                placeholder="Longitude"
                value={formData.coordinates[1]}
                onChange={(e) => handleCoordinatesChange(1, e.target.value)}
              />
            </div>

            <button 
              type="button" 
              className="next-btn"
              onClick={handleNextStep}
            >
              Continuer
            </button>
            <button 
              type="button" 
              className="prev-btn"
              onClick={handlePrevStep}
            >
              Précédent
            </button>
          </div>
        )}

        {/* Step 4: Subscription Selection */}
        {step === 4 && (
          <div className="step subscription-selection">
            <h2>Sélectionnez un abonnement</h2>
            <SubscriptionPlans onSelect={handleSubscriptionSelect} />
            
            <button 
              type="button" 
              className="prev-btn"
              onClick={handlePrevStep}
            >
              Précédent
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Chargement..." : "S'inscrire"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;