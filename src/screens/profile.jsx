import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/TopBar";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <TopBar />
      <div className="min-h-screen py-12">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md border border-gray-200">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Profile
          </h1>
          <div className="h-50 justify-center flex items-center m-5">
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              alt="Profile"
              className="h-50 w-50 rounded-full border-2  border-white "
            />
          </div>

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
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors hover:cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
