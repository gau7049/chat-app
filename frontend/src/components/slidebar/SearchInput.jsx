import React, { useState, useRef, useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";
import { IoSearchSharp } from "react-icons/io5";
import { FaEllipsisV, FaUserEdit, FaPlus, FaUsers } from "react-icons/fa";

function SearchInput() {
  const [search, setSearch] = useState("");
  const { setSelectedConversation, setDestination } = useConversation();
  const { conversations } = useGetConversations();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropDownRef = useRef(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropDownRef]);

  const inviteLink = `http://localhost:7049/`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Invite a Friend",
          text: "Join me on this chat app!",
          url: inviteLink,
        });
        toast.success("Invite sent successfully!");
      } catch (error) {
        toast.error("Sharing failed.");
      }
    } else {
      copyLink(); // Fallback if sharing isn't supported
    }
  };

  // Handle form submission for searching conversations
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c) =>
      c.fullname.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      toast.error("No such user found!");
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle option to update DP/Status/Bio
  const updateData = () => {
    setDestination("editOwnData");
    setDropdownOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between gap-2 p-2 bg-gray-900 rounded-lg">
      <form className="flex items-center gap-2 w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered bg-gray-800 text-white rounded-full w-full text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 m-0 sm:p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition duration-200"
        >
          <IoSearchSharp className="w-5 h-5 outline-none" />
        </button>
      </form>

      {/* User Options Dot */}
      <div className="relative">
        <FaEllipsisV
          className="w-6 h-6 cursor-pointer text-gray-400 hover:text-gray-200 transition"
          onClick={toggleDropdown}
        />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10" ref={dropDownRef}>
            <ul className="py-1 text-sm text-gray-200">
              <li
                className="hover:bg-gray-700 px-4 py-2 cursor-pointer flex items-center transition duration-200"
                onClick={updateData}
              >
                <FaUserEdit className="mr-2" /> Update DP/Status/Bio
              </li>
              <li className="hover:bg-gray-700 px-4 py-2 cursor-pointer flex items-center transition duration-200" onClick={shareLink}>
                <FaPlus className="mr-2" /> Invite Friend
              </li>
              <li className="hover:bg-gray-700 px-4 py-2 cursor-pointer flex items-center transition duration-200">
                <FaUsers className="mr-2" /> Create Group
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchInput;
