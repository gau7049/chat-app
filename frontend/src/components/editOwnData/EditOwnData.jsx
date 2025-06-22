import React, { useState } from "react";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";

const EditOwnData = ({ back }) => {
  const { setDestination } = useConversation();
  const { authUser } = useAuthContext();
  const [fullName, setFullName] = useState(authUser?.fullname);
  const [dp, setDp] = useState(authUser?.profilePic); // Store uploaded DP
  const [phone, setPhone] = useState("+1-234-567-890"); // Example phone number
  const [location, setLocation] = useState("New York, USA"); // Example location
  const [bio, setBio] = useState("Software Engineer"); // Example bio
  const [status, setStatus] = useState("Available"); // Example status

  const handleDpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDp(URL.createObjectURL(file)); // Convert file to image URL for preview
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 w-full h-full flex items-center justify-center">
      <div className="max-w-md w-full p-6 rounded-lg shadow-lg space-y-4">
        {/* Profile Section */}
        <div className="flex items-center space-x-3">
          <img
            className="w-16 h-16 rounded-full object-cover border-4 border-gray-700 shadow-lg"
            src={dp || "https://via.placeholder.com/150"} // Show uploaded DP or placeholder
            alt="Profile"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Edit Profile</h2>
            <input
              type="file"
              accept="image/*"
              className="mt-1 text-sm text-gray-300"
              onChange={handleDpChange}
            />
          </div>
        </div>

        {/* Editable Fields Section */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name Section */}
          <div className="flex justify-between items-center">
            <label className="text-gray-500 text-sm">Full Name:</label>
            <input
              type="text"
              className="p-2 text-sm rounded"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-gray-500 text-sm">Phone Number:</label>
            <input
              type="tel"
              className="p-2 text-sm rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="">Location:</label>
            <input
              type="text"
              className="p-2 text-sm rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="">Bio:</label>
            <input
              type="text"
              className="p-2 text-sm rounded"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-gray-500 text-sm">Status:</label>
            <select
              className="p-2 text-sm rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Away">Away</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-sm"
            onClick={() => setDestination("")}
          >
            Save Changes
          </button>
        </form>

        {/* Back Button */}
        <button
          className="w-full py-2 mt-3 rounded-lg font-semibold transition-all text-sm"
          onClick={() => setDestination("")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EditOwnData;
