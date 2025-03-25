import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchitectProfile } from "../../../../../redux/slices/architectSlice";
import { Edit, Trash, CreditCard, File, Star } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.architect);

  useEffect(() => {
    dispatch(fetchArchitectProfile());
  }, [dispatch]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) {
    return (
      <p className="text-center text-red-500">
        Error: {error.message || JSON.stringify(error)}
      </p>
    );
  }
  if (!profile) return <p className="text-center">No profile data found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 bg-white shadow-md rounded-xl p-6">
        <img
          src={profile.profilePicture || "/default-avatar.png"}
          alt={`${profile.prenom || "User"}'s Profile`}
          className="w-20 h-20 rounded-full border-2 border-gray-300"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {profile.prenom} {profile.nomDeFamille}
          </h2>
          <p className="text-gray-500">{profile.email}</p>
          <p className="text-gray-500">
            {profile.location?.country || "Unknown"},{" "}
            {profile.location?.region || "Unknown"}
          </p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Personal Info */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Info</h3>
          <p className="text-gray-600">
            <strong>Phone:</strong> {profile.phoneNumber || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Architect ID:</strong>{" "}
            {profile.architectId?.toString() || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Verified:</strong> {profile.isVerified ? "✅ Yes" : "❌ No"}
          </p>
        </div>

        {/* Subscription Info */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
          <p className="text-gray-600">
            <strong>Plan:</strong> {profile.subscription?.plan || "Free"}
          </p>
          <p className="text-gray-600">
            <strong>Expires on:</strong>
            {profile.subscription?.expiryDate
              ? new Date(profile.subscription.expiryDate).toLocaleDateString()
              : "N/A"}
          </p>
          <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <CreditCard size={16} /> Manage Subscription
          </button>
        </div>
      </div>

      {/* Portfolio & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Portfolio */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
          {profile.portfolio?.length ? (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {profile.portfolio.slice(0, 3).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No portfolio images available.</p>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
          <div className="flex justify-between text-gray-700 mt-2">
            <div className="flex items-center space-x-2">
              <File size={20} className="text-blue-500" />
              <p>
                <strong>{profile.stats?.projects || 0}</strong> Projects
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Star size={20} className="text-yellow-500" />
              <p>
                <strong>{profile.stats?.reviews || 0}</strong> Reviews
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard size={20} className="text-green-500" />
              <p>
                <strong>${profile.stats?.earnings || 0}</strong> Earnings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Edit size={16} /> Edit Profile
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Trash size={16} /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
