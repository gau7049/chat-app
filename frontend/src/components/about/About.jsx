import React from "react";
import useConversation from "../../zustand/useConversation";

const About = ({ back }) => {
  const { selectedConversation } = useConversation();
  console.log("selectedConversation: ", selectedConversation);
  return (
    <>
      <div className="p-6 w-full h-full bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <img
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-700 shadow-lg"
              src={selectedConversation?.profilePic} // Replace with user profile image URL
              alt="Profile"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-100">
                {selectedConversation?.fullname}
              </h2>
              <p className="text-sm text-gray-400">Software Engineer</p>{" "}
              {/* Add a title or role */}
            </div>
          </div>

          {/* Information Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Phone Number:</span>
              <span className="font-medium text-gray-100">+1-234-567-890</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Location:</span>
              <span className="font-medium text-gray-100">New York, USA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Gender:</span>
              <span className="font-medium text-gray-100">Male</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Last Seen:</span>
              <span className="font-medium text-gray-100">5 minutes ago</span>{" "}
              {/* Dynamic last seen info */}
            </div>
          </div>

          {/* Back Button */}
          <div>
            <button
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={back} // Ensure 'back' is correctly defined elsewhere as a function
            >
              Back to Chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
