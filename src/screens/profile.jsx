import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Profile
        </h1>

        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <p className="text-lg text-gray-800">{currentUser?.name}</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <p className="text-lg text-gray-800">{currentUser?.email}</p>
          </div>

          <div>
            <button
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
