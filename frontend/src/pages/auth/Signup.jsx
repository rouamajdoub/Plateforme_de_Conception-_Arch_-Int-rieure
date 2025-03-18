import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import "../../styles/Auth.css";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("client");

  const onSubmit = (data) => {
    const formData = { ...data, role: userType };
    console.log("Registration Data:", formData); // Log the form data

    // Handle step navigation
    if (userType === "architect" && step < 5) {
      setStep(step + 1);
    } else if (userType === "client" && step < 2) {
      setStep(step + 1);
    } else {
      dispatch(registerUser(formData));
    }
  };

  return (
    <div className="signup-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="form-step">
            <h2>Step 1: Basic Details</h2>
            <div className="form-group">
              <input
                {...register("pseudo", { required: "Username is required" })}
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
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                type="email"
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("password", { required: "Password is required" })}
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
                className="btn"
              >
                Sign up as Client
              </button>
              <button
                type="button"
                onClick={() => setUserType("architect")}
                className="btn"
              >
                Sign up as Architect
              </button>
              <button type="submit" className="btn">
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
            <button type="submit" className="btn">
              Next
            </button>
          </div>
        )}

        {step === 3 && userType === "architect" && (
          <div className="form-step">
            <h2>Step 3: Choose Subscription</h2>
            <select
              {...register("subscriptionPlan", {
                required: "Subscription plan is required",
              })}
              className="select-box"
            >
              <option value="">Select a plan</option>
              <option value="free">Free</option>
              <option value="pro">Pro - 120 TND/Year</option>
              <option value="business">Business - 200 TND/Year</option>
            </select>
            {errors.subscriptionPlan && (
              <p className="error-message">{errors.subscriptionPlan.message}</p>
            )}
            <button type="submit" className="btn">
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h2>Step 4: Confirmation</h2>
            <p>
              Your registration request has been sent. Please wait for approval.
            </p>
            <button type="submit" className="btn">
              Finish
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
