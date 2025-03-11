import React, { useState, useEffect, useRef } from "react";
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

  // References for software proficiency inputs
  const softwareNameRef = useRef(null);
  const softwareLevelRef = useRef(null);

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
        passwordMatch: 
          !formData[otherField] || 
          value === formData[otherField]
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
    const name = softwareNameRef.current.value.trim();
    const level = softwareLevelRef.current.value.trim();
    
    if (name && level) {
      // Check if software already exists
      const existingSoftware = formData.softwareProficiency.find(
        software => software.name.toLowerCase() === name.toLowerCase()
      );
      
      if (!existingSoftware) {
        setFormData((prev) => ({
          ...prev,
          softwareProficiency: [
            ...prev.softwareProficiency,
            { name, level }
          ]
        }));
      }
      
      // Clear inputs
      softwareNameRef.current.value = "";
      softwareLevelRef.current.value = "";
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
    // Validate if it's a proper number
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      newCoordinates[index] = parsedValue;
    } else {
      newCoordinates[index] = 0;
    }
    
    setFormData((prev) => ({
      ...prev,
      coordinates: newCoordinates
    }));
  };

  // Remove item from arrays
  const handleRemoveItem = (array, index) => {
    setFormData((prev) => {
      const newArray = [...prev[array]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [array]: newArray
      };
    });
  };

  const handleRemoveSoftware = (index) => {
    setFormData((prev) => {
      const newArray = [...prev.softwareProficiency];
      newArray.splice(index, 1);
      return {
        ...prev,
        softwareProficiency: newArray
      };
    });
  };

  // Handle subscription selection
  const handleSubscriptionSelect = (subscriptionPlan) => {
    setFormData((prev) => ({
      ...prev,
      subscription: subscriptionPlan
    }));
    setStep(5); // Move to confirmation step
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
      const requiredFields = ["pseudo", "nomDeFamille", "prenom", "email", "password", "confirmPassword", "pays", "region", "city"];
      
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
      
      // Terms validation for all users
      if (!(formData.contentTerm && formData.cgvAndCguTerm && formData.majorTerm)) {
        setValidation((prev) => ({
          ...prev,
          termsAccepted: false
        }));
        setError("Vous devez accepter les conditions générales");
        return;
      }
    }
    
    // Validation for Step 3 (Architect specific)
    if (step === 3 && formData.role === "architect") {
      const requiredArchitectFields = ["companyName", "experienceYears"];
      
      for (const field of requiredArchitectFields) {
        if (!formData[field]) {
          setError(`Le champ ${field} est requis`);
          return;
        }
      }
      
      // Validate experienceYears is a number
      if (isNaN(parseFloat(formData.experienceYears))) {
        setError("Les années d'expérience doivent être un nombre");
        return;
      }
    }
    
    // If all validations pass, proceed to next step
    setError(null);
    setStep(step + 1);
    
    // Skip subscription step for clients
    if (step === 3 && formData.role === "client") {
      setStep(5); // Skip to confirmation
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
        <div className="step-line"></div>
        <div className={`step-dot ${step >= 5 ? "active" : ""}`}>5</div>
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
                J'accepte les conditions générales *
              </label>
              <label>
                <input
                  type="checkbox"
                  name="cgvAndCguTerm"
                  checked={formData.cgvAndCguTerm}
                  onChange={handleChange}
                />
                J'accepte les CGV et CGU *
              </label>
              <label>
                <input
                  type="checkbox"
                  name="majorTerm"
                  checked={formData.majorTerm}
                  onChange={handleChange}
                />
                J'ai plus de 18 ans *
              </label>
              <label>
                <input
                  type="checkbox"
                  name="infoTerm"
                  checked={formData.infoTerm}
                  onChange={handleChange}
                />
                Je souhaite recevoir des informations
              </label>
              {!validation.termsAccepted && (
                <span className="validation-error">Vous devez accepter les conditions obligatoires (*)</span>
              )}
            </div>

            <div className="form-buttons">
              <button 
                type="button" 
                className="prev-btn"
                onClick={handlePrevStep}
              >
                Précédent
              </button>
              <button 
                type="button" 
                className="next-btn"
                onClick={handleNextStep}
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Architect Specific Fields */}
        {step === 3 && (
          <div className="step architect-info">
            <h2>Informations professionnelles</h2>

            {formData.role === "architect" && (
              <>
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
                    min="0"
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
                  <label>Spécialisations</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      placeholder="Ajoutez une spécialisation"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSpecializationChange(e);
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={(e) => {
                        handleSpecializationChange({ target: e.target.previousSibling })
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  {formData.specialization.length > 0 && (
                    <div className="tags-container">
                      {formData.specialization.map((spec, index) => (
                        <div key={index} className="tag">
                          {spec}
                          <button 
                            type="button" 
                            className="remove-tag" 
                            onClick={() => handleRemoveItem('specialization', index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Certifications</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      placeholder="Ajoutez une certification"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCertificationChange(e);
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={(e) => {
                        handleCertificationChange({ target: e.target.previousSibling })
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  {formData.certifications.length > 0 && (
                    <div className="tags-container">
                      {formData.certifications.map((cert, index) => (
                        <div key={index} className="tag">
                          {cert}
                          <button 
                            type="button" 
                            className="remove-tag" 
                            onClick={() => handleRemoveItem('certifications', index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Maîtrise des logiciels</label>
                  <div className="software-inputs">
                    <input
                      type="text"
                      id="softwareName"
                      ref={softwareNameRef}
                      placeholder="Nom du logiciel"
                    />
                    <select 
                      id="softwareLevel"
                      ref={softwareLevelRef}
                    >
                      <option value="">Niveau de compétence</option>
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button 
                      type="button" 
                      onClick={handleSoftwareChange}
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  {formData.softwareProficiency.length > 0 && (
                    <div className="software-list">
                      {formData.softwareProficiency.map((software, index) => (
                        <div key={index} className="software-item">
                          <span>{software.name} - {software.level}</span>
                          <button 
                            type="button" 
                            className="remove-software" 
                            onClick={() => handleRemoveSoftware(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Éducation</label>
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
                    type="number"
                    name="graduationYear"
                    placeholder="Année de graduation"
                    value={formData.education.graduationYear}
                    onChange={handleEducationChange}
                    min="1900"
                    max={new Date().getFullYear()}
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
                  <label>Réseaux sociaux</label>
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
              </>
            )}

            <div className="form-buttons">
              <button 
                type="button" 
                className="prev-btn"
                onClick={handlePrevStep}
              >
                Précédent
              </button>
              <button 
                type="button" 
                className="next-btn"
                onClick={handleNextStep}
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Subscription Selection for Architects */}
        {step === 4 && formData.role === "architect" && (
          <div className="step subscription-selection">
            <h2>Sélectionnez un abonnement</h2>
            <SubscriptionPlans onSelect={handleSubscriptionSelect} />
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="prev-btn"
                onClick={handlePrevStep}
              >
                Précédent
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation and Submission */}
        {step === 5 && (
          <div className="step confirmation">
            <h2>Confirmation</h2>
            
            <div className="summary">
              <h3>Récapitulatif</h3>
              <p><strong>Nom:</strong> {formData.prenom} {formData.nomDeFamille}</p>
              <p><strong>Pseudo:</strong> {formData.pseudo}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Rôle:</strong> {formData.role === "architect" ? "Architecte" : "Client"}</p>
              
              {formData.role === "architect" && (
                <>
                  <p><strong>Entreprise:</strong> {formData.companyName}</p>
                  <p><strong>Années d'expérience:</strong> {formData.experienceYears}</p>
                  <p><strong>Abonnement:</strong> {formData.subscription?.name || "Aucun abonnement sélectionné"}</p>
                </>
              )}
            </div>
            
            <div className="form-buttons">
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
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;