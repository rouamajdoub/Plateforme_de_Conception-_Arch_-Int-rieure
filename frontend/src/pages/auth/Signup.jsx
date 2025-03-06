import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import SubscriptionPlans from "../../components/subs/SubscriptionPlans";
import "../../styles/Auth.css";

const Signup = () => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    role: "",
    pseudo: "",
    nomDeFamille: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    companyName: "",
    experienceYears: "",
    specialization: [],
    portfolioURL: "",
    certifications: [],
    region: "",
    country: "", // New field for country
    city: "",
    location: {
      coordinates: {
        type: "Point", // Default type for coordinates
        coordinates: [], // Array for longitude and latitude
      },
    },
    subscription: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoordinatesChange = (longitude, latitude) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          ...prev.location.coordinates,
          coordinates: [longitude, latitude],
        },
      },
    }));
  };

  const handleSpecializationChange = (e) => {
    const { value } = e.target;
    if (!formData.specialization.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        specialization: [...prev.specialization, value],
      }));
    }
  };

  const handleCertificationChange = (e) => {
    const { value } = e.target;
    if (!formData.certifications.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, value],
      }));
    }
  };

  const handleSubscriptionSelect = (subscriptionId) => {
    setFormData((prev) => ({ ...prev, subscription: subscriptionId }));
    setStep(4); // Go to confirmation step
  };

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((response) => {
      if (!response.error) {
        alert("Inscription réussie !");
        navigate("/login");
      }
    });
  };

  return (
    <div className="wrapper">
      <h2>Inscription</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Step 1 - Role selection */}
        {step === 1 && (
          <div className="step">
            <h3>Choisissez votre rôle</h3>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez...</option>
              <option value="client">Client</option>
              <option value="architect">Architecte</option>
            </select>
            <button
              type="button"
              className="btn"
              onClick={handleNextStep}
              disabled={!formData.role}
            >
              Suivant
            </button>
          </div>
        )}

        {/* Step 2 - Personal information */}
        {step === 2 && (
          <div className="step">
            <h3>Informations personnelles</h3>
            <input
              type="text"
              name="pseudo"
              placeholder="Pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="nomDeFamille"
              placeholder="Nom de famille"
              value={formData.nomDeFamille}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Numéro de téléphone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="companyName"
              placeholder="Nom de l'entreprise"
              value={formData.companyName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="portfolioURL"
              placeholder="Portfolio URL"
              value={formData.portfolioURL}
              onChange={handleChange}
            />
            <input
              type="number"
              name="experienceYears"
              placeholder="Années d'expérience"
              value={formData.experienceYears}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="specialization"
              placeholder="Spécialisation"
              onChange={handleSpecializationChange}
              required
            />
            <input
              type="text"
              name="certifications"
              placeholder="Certifications"
              onChange={handleCertificationChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Pays"
              value={formData.country}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="region"
              placeholder="Région"
              value={formData.region}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="Ville"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Longitude"
              onChange={(e) =>
                handleCoordinatesChange(
                  e.target.value,
                  formData.location.coordinates.coordinates[1] || 0
                )
              }
              required
            />
            <input
              type="number"
              placeholder="Latitude"
              onChange={(e) =>
                handleCoordinatesChange(
                  formData.location.coordinates.coordinates[0] || 0,
                  e.target.value
                )
              }
              required
            />
            <button type="button" className="btn" onClick={handlePrevStep}>
              Précédent
            </button>
            <button type="button" className="btn" onClick={handleNextStep}>
              Suivant
            </button>
          </div>
        )}

        {/* Step 3 - Subscription selection */}
        {step === 3 && (
          <div className="step">
            <h3>Choisissez un abonnement</h3>
            <SubscriptionPlans onSelect={handleSubscriptionSelect} />
            <button type="button" className="btn" onClick={handlePrevStep}>
              Précédent
            </button>
          </div>
        )}

        {/* Step 4 - Confirmation and signup */}
        {step === 4 && (
          <div className="step">
            <h3>Confirmation</h3>
            <p>
              Merci d'avoir rempli le formulaire ! Cliquez sur "S'inscrire" pour
              finaliser.
            </p>
            <button type="button" className="btn" onClick={handlePrevStep}>
              Précédent
            </button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </div>
        )}
      </form>
      <p className="registre-link">
        Déjà un compte ? <a href="/login">Se connecter</a>
      </p>
    </div>
  );
};

export default Signup;
