import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  selectAuthStatus,
  selectAuthError,
  resetStatus,
} from "../../redux/slices/authSlice";
import SubscriptionStep from "./SubscriptionStep";
import "./styles/Auth.css";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Reset status when component unmounts
    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch]);

  const onSubmit = (data) => {
    // Prepare form data with user type and subscription
    const formData = {
      ...data,
      role: userType,
      subscription: userType === "architect" ? subscription : null,
    };

    // Dispatch registration action
    dispatch(registerUser(formData));
  };

  const handleNextStep = () => {
    if (userType === "architect" && step < 4) {
      setStep(step + 1);
    } else if (userType === "client" && step < 2) {
      setStep(step + 1);
    }
  };

  const renderRegistrationStatus = () => {
    if (authStatus === "loading") {
      return (
        <div className="registration-status text-blue-600">
          Processing your registration...
        </div>
      );
    }

    if (authStatus === "succeeded") {
      return (
        <div className="registration-status text-green-600">
          {userType === "architect"
            ? "Your registration is pending admin approval. Please check your email regularly for updates."
            : "Registration successful! You can now log in."}
        </div>
      );
    }

    if (authStatus === "failed") {
      return (
        <div className="registration-status text-red-600">
          {authError || "Registration failed. Please try again."}
        </div>
      );
    }

    return null;
  };

  const resetForm = () => {
    reset();
    setStep(1);
    setUserType(null);
    setSubscription(null);
    dispatch(resetStatus());
  };

  return (
    <div className="signup-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="form-step">
            <h2>Step 1: Basic Details</h2>
            <div className="form-group">
              <input
                {...register("pseudo", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                placeholder="Username"
              />
              {errors.pseudo && (
                <p className="error-message">{errors.pseudo.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("nomDeFamille", {
                  required: "Last name is required",
                })}
                placeholder="Last Name"
              />
              {errors.nomDeFamille && (
                <p className="error-message">{errors.nomDeFamille.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("prenom", { required: "First name is required" })}
                placeholder="First Name"
              />
              {errors.prenom && (
                <p className="error-message">{errors.prenom.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email"
                type="email"
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                placeholder="Password"
                type="password"
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>
            <div className="form-buttons">
              <button
                type="button"
                onClick={() => setUserType("client")}
                className={`btn role-btn ${
                  userType === "client" ? "selected-client" : ""
                }`}
              >
                Sign up as Client
              </button>
              <button
                type="button"
                onClick={() => setUserType("architect")}
                className={`btn role-btn ${
                  userType === "architect" ? "selected-architect" : ""
                }`}
              >
                Sign up as Architect
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn next-btn"
                disabled={!userType}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Location/Professional Details */}
        {step === 2 && userType === "client" && (
          <div className="form-step">
            <h2>Step 2: Location Details</h2>
            <div className="form-group">
              <input
                {...register("location.country", {
                  required: "Country is required",
                })}
                placeholder="Country"
              />
              {errors.location?.country && (
                <p className="error-message">
                  {errors.location.country.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("location.region", {
                  required: "Region is required",
                })}
                placeholder="Region"
              />
              {errors.location?.region && (
                <p className="error-message">
                  {errors.location.region.message}
                </p>
              )}
            </div>
            <button type="submit" className="btn">
              Finish Registration
            </button>
          </div>
        )}

        {step === 2 && userType === "architect" && (
          <div className="form-step">
            <h2>Step 2: Professional Details</h2>
            <div className="form-group">
              <input
                {...register("cin", { required: "CIN is required" })}
                placeholder="CIN"
              />
              {errors.cin && (
                <p className="error-message">{errors.cin.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("patenteNumber", {
                  required: "Patente number is required",
                })}
                placeholder="Patente Number"
              />
              {errors.patenteNumber && (
                <p className="error-message">{errors.patenteNumber.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("companyName", {
                  required: "Company name is required",
                })}
                placeholder="Company Name"
              />
              {errors.companyName && (
                <p className="error-message">{errors.companyName.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("experienceYears", {
                  required: "Years of experience is required",
                  min: {
                    value: 0,
                    message: "Experience years must be a positive number",
                  },
                })}
                placeholder="Years of Experience"
                type="number"
              />
              {errors.experienceYears && (
                <p className="error-message">
                  {errors.experienceYears.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                placeholder="Specialization"
              />
              {errors.specialization && (
                <p className="error-message">{errors.specialization.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("portfolioURL", {
                  required: "Portfolio URL is required",
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/,
                    message: "Invalid URL format",
                  },
                })}
                placeholder="Portfolio URL"
                type="url"
              />
              {errors.portfolioURL && (
                <p className="error-message">{errors.portfolioURL.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("certifications")}
                placeholder="Certifications (comma separated)"
              />
            </div>
            <div className="form-group">
              <input {...register("education")} placeholder="Education" />
            </div>
            <div className="form-group">
              <input
                {...register("softwareProficiency")}
                placeholder="Software Proficiency (comma separated)"
              />
            </div>
            <button type="button" onClick={handleNextStep} className="btn">
              Next
            </button>
          </div>
        )}

        {/* Step 3: Subscription for Architect */}
        {step === 3 && userType === "architect" && (
          <SubscriptionStep
            onNext={() => setStep(4)}
            onSelectSubscription={setSubscription}
          />
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && userType === "architect" && (
          <div className="form-step">
            <h2>Step 4: Confirmation</h2>
            <p>Please review your information before submitting.</p>
            <button type="submit" className="btn">
              Submit Registration
            </button>
          </div>
        )}

        {/* Registration Status */}
        {renderRegistrationStatus()}

        {/* Reset Form Button (only show when registration is successful or failed) */}
        {(authStatus === "succeeded" || authStatus === "failed") && (
          <button type="button" onClick={resetForm} className="btn reset-btn">
            Start Over
          </button>
        )}
      </form>
    </div>
  );
};

export default Signup;
