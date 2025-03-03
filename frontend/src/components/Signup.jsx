import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import SubscriptionPlans from "./subs/SubscriptionPlans";
import "../styles/Auth.css";

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
    region: "",
    city: "",
    experienceYears: "",
    specialization: "",
    certifications: "",
    subscription: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubscriptionSelect = (subscriptionId) => {
    setFormData({ ...formData, subscription: subscriptionId });
    setStep(4);
  };

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // Log formData for debugging
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
        {/* Étape 1 - Sélection du rôle */}
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

        {/* Étape 2 - Informations personnelles */}
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

            {formData.role === "architect" && (
              <>
                <h4>Informations professionnelles</h4>
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
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="certifications"
                  placeholder="Certifications"
                  value={formData.certifications}
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
                  required
                />
              </>
            )}

            <button type="button" className="btn" onClick={handlePrevStep}>
              Précédent
            </button>
            <button type="button" className="btn" onClick={handleNextStep}>
              Suivant
            </button>
          </div>
        )}

        {/* Étape 3 - Sélection de l'abonnement (uniquement pour les architectes) */}
        {step === 3 && formData.role === "architect" && (
          <div className="step">
            <h3>Choisissez un abonnement</h3>
            <SubscriptionPlans onSelect={handleSubscriptionSelect} />
            <button type="button" className="btn" onClick={handlePrevStep}>
              Précédent
            </button>
          </div>
        )}

        {/* Étape 4 - Confirmation et inscription */}
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
