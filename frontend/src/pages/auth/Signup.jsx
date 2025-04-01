import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  registerUser,
  selectAuthStatus,
  selectAuthError,
  resetStatus,
} from "../../redux/slices/authSlice";
import "./styles/Auth.css";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (authStatus === "succeeded") {
      if (userType === "architect") {
        setIsSubmitted(true);
      } else {
        const timer = setTimeout(() => {
          navigate("/login");
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [authStatus, navigate, userType]);

  useEffect(() => {
    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch]);

  const onSubmit = (data) => {
    // Map the data to match the expected backend structure
    let formData = { ...data, role: userType };

    // For client, convert location.country to pays and structure correctly
    if (userType === "client") {
      formData = {
        ...formData,
        pays: data.location?.country,
        region: data.location?.region,
        city: data.location?.city || "",
      };
      // Remove the nested location object since we're flattening it
      delete formData.location;
    }
    // For architect, ensure all required fields are properly formatted
    else if (userType === "architect") {
      formData = {
        ...formData,
        // Convert any arrays from comma-separated strings
        certifications: data.certifications
          ? data.certifications.split(",").map((item) => item.trim())
          : [],
        softwareProficiency: data.softwareProficiency
          ? data.softwareProficiency.split(",").map((item) => item.trim())
          : [],
        // Ensure numeric fields are numbers
        experienceYears: parseInt(data.experienceYears, 10),
        // Add default values for required location info
        pays: "",
        region: "",
        city: "",
        // Ensure coordinates has a default value
        coordinates: [0, 0],
      };
    }

    console.log("Submitting registration data:", formData);
    dispatch(registerUser(formData));
  };

  const handleNextStep = () => {
    if ((userType === "client" || userType === "architect") && step < 2) {
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
    setIsSubmitted(false);
    dispatch(resetStatus());
  };

  return (
    <div className="signup-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="form-step">
            <h2>Step 1: Basic Details</h2>
            <div className="form-group">
              <select
                {...register("role", { required: "Role is required" })}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="client">Client</option>
                <option value="architect">Architect</option>
              </select>
              {errors.role && (
                <p className="error-message">{errors.role.message}</p>
              )}
            </div>
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
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
                onClick={handleNextStep}
                className="btn next-btn"
                disabled={!userType}
              >
                Next
              </button>
            </div>
          </div>
        )}

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
            <div className="form-group">
              <input
                {...register("location.city")}
                placeholder="City (Optional)"
              />
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
                    value: /^(https?:\/\/)?([\w.-]+)(:[0-9]+)?(\/[^\s]*)?$/,
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
            <div className="form-group">
              <input {...register("pays")} placeholder="Country" />
            </div>
            <div className="form-group">
              <input {...register("region")} placeholder="Region" />
            </div>
            <div className="form-group">
              <input {...register("city")} placeholder="City" />
            </div>
            <button type="submit" className="btn">
              Finish Registration
            </button>
          </div>
        )}

        {isSubmitted && userType === "architect" && (
          <div className="form-step">
            <h2>Registration Successful</h2>
            <p>
              Your registration request has been sent successfully. Please wait
              for admin approval. You will receive a confirmation email shortly.
              Be sure to check your inbox!
            </p>
            <button type="button" onClick={resetForm} className="btn reset-btn">
              Start Over
            </button>
          </div>
        )}

        {renderRegistrationStatus()}

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
