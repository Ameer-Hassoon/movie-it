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
        <div className="max-w-md mx-auto p-8 rounded-lg shadow-2xl border-0">
          <h1 className="text-4xl font-bold text-center mb-8">Profile</h1>
          <div className="h-50 justify-center flex items-center m-5">
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              alt="Profile"
              className="h-50 w-50 rounded-full border-0 "
            />
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-500 pb-4">
              <label className="block text-sm font-medium ">Name</label>
              <p className="text-lg ">{currentUser?.name}</p>
            </div>

            <div className="border-b border-gray-500 pb-4">
              <label className="block text-sm font-medium ">Email</label>
              <p className="text-lg">{currentUser?.email}</p>
            </div>

            <div>
              <button
                className="bg-sky-900  py-3 px-6 rounded-lg w-full font-semibold hover:bg-sky-950 transition-colors hover:cursor-pointer "
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
