import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchitectProfile } from "../../../../../redux/slices/architectSlice";
import { Edit, Trash, CreditCard, File, Star } from "lucide-react";
import Banner from "../../img/Beige_Modern_Elegant_Banner.png";
import "./Profile.css"; // Import du fichier CSS

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.architect);

  useEffect(() => {
    dispatch(fetchArchitectProfile());
  }, [dispatch]);

  // Log the profile data when it changes
  useEffect(() => {
    console.log(profile);
  }, [profile]); // This will log whenever the profile changes

  if (loading) return <p className="loading">Loading...</p>;
  if (error) {
    return (
      <p className="error">Error: {error.message || JSON.stringify(error)}</p>
    );
  }
  if (!profile) return <p className="no-data">No profile data found.</p>;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="p-header-container">
        {/* Banner Image */}
        <div className="banner">
          <img src={Banner} alt="Banner" className="banner-image" />
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <img
            src={profile.profilePicture || "/default-avatar.png"}
            alt={`${profile.prenom || "User"}'s Profile`}
            className="profile-image"
          />
          <div className="profile-info">
            {profile.prenom} {profile.nomDeFamille}
            <p className="profile-email">{profile.email}</p>
            <p className="profile-location">
              {profile.location?.country || "Unknown"},{" "}
              {profile.location?.region || "Unknown"}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="profile-grid">
        {/* Personal Info */}
        <div className="info-card">
          <h3>Personal Info</h3>
          <p>
            <strong>Phone:</strong> {profile.phoneNumber || "N/A"}
          </p>
          <p>
            <strong>Experience:</strong> {profile.experienceYears || "N/A"}{" "}
            years
          </p>
          <p>
            <strong>Company:</strong> {profile.companyName || "N/A"}
          </p>
          <p>
            <strong>Specialty:</strong> {profile.specialty || "N/A"}
          </p>
          <p>
            <strong>Certification:</strong> {profile.certification || "N/A"}
          </p>
          <p>
            <strong>Verified:</strong> {profile.isVerified ? "✅ Yes" : "❌ No"}
          </p>
        </div>

        {/* Subscription Info */}
        <div className="info-card">
          <h3>Subscription</h3>
          <p>
            <strong>Plan:</strong> {profile.subscription?.plan || "Free"}
          </p>
          <p>
            <strong>Expires on:</strong>{" "}
            {profile.subscription?.expiryDate
              ? new Date(profile.subscription.expiryDate).toLocaleDateString()
              : "N/A"}
          </p>
          <button className="btn btn-blue">
            <CreditCard size={16} /> Manage Subscription
          </button>
        </div>
      </div>

      {/* Portfolio & Stats */}
      <div className="profile-grid">
        {/* Portfolio */}
        <div className="info-card">
          <h3>Portfolio</h3>
          {profile.portfolio?.length ? (
            <div className="portfolio-grid">
              {profile.portfolio.slice(0, 3).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Portfolio ${index + 1}`}
                  className="portfolio-image"
                />
              ))}
            </div>
          ) : (
            <p className="no-data">No portfolio images available.</p>
          )}
        </div>

        {/* Statistics */}
        <div className="info-card">
          <h3>Statistics</h3>
          <div className="stats-container">
            <div className="stat-item">
              <File size={20} className="icon-blue" />
              <p>
                <strong>{profile.stats?.projects || 0}</strong> Projects
              </p>
            </div>
            <div className="stat-item">
              <Star size={20} className="icon-yellow" />
              <p>
                <strong>{profile.stats?.reviews || 0}</strong> Reviews
              </p>
            </div>
            <div className="stat-item">
              <CreditCard size={20} className="icon-green" />
              <p>
                <strong>${profile.stats?.earnings || 0}</strong> Earnings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="profile-actions">
        <button className="btn btn-blue">
          <Edit size={16} /> Edit Profile
        </button>
        <button className="btn btn-red">
          <Trash size={16} /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
