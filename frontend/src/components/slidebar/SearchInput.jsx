import React, { useState, useRef, useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";
import { IoSearchSharp } from "react-icons/io5";
import { FaEllipsisV, FaUserEdit, FaPlus, FaUsers } from "react-icons/fa";
import LogoutButton from "./LogoutButton.jsx"

function SearchInput() {
  const [search, setSearch] = useState("");
  const { setSelectedConversation, setDestination, Updatedconversation, activeOnly, setActiveOnly, totalActiveUser } = useConversation();
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

    const conversation = Updatedconversation.find((c) =>
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
    <>
    <div className="relative flex items-center justify-between gap-2 py-2 rounded-lg">
      <form className="flex items-center gap-2 w-full search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered rounded-full w-full text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {/* User Options Dot */}
      <div className="relative">
        <FaEllipsisV
          className="w-6 h-6 cursor-pointer text-gray-400 hover:text-gray-200 transition"
          onClick={toggleDropdown}
          />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10" ref={dropDownRef}>
            <ul className="py-1 text-sm text-gray-200">
              <li
                className="px-4 py-2 cursor-pointer flex items-center transition duration-200"
                onClick={updateData}
                >
                <FaUserEdit className="mr-2" /> Update DP/Status/Bio
              </li>
              <li className="px-4 py-2 cursor-pointer flex items-center transition duration-200" onClick={shareLink}>
                <FaPlus className="mr-2" /> Invite Friend
              </li>
              <li className="px-4 py-2 cursor-pointer flex items-center transition duration-200">
                <FaUsers className="mr-2" /> Create Group
              </li>
              <li className="px-4 py-2 cursor-pointer flex items-center transition duration-200">
                <LogoutButton />
              </li>

            </ul>
          </div>
        )}
      </div>
    </div>
       {/* Checkbox for Active Users */}
       <div className="flex justify-between items-center">
        <div>
        <input
          type="checkbox"
          id="activeOnly"
          className="mr-2 cursor-pointer"
          checked={activeOnly}
          onChange={(e) => setActiveOnly(e.target.checked)}
          />
        <label htmlFor="activeOnly" className="">
          Active Users {activeOnly && `(${totalActiveUser})`}
        </label>
          </div>
      </div>
          </>
  );
}

export default SearchInput;
