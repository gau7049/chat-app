import React, { useEffect, useState, useRef } from "react";
import Messages from "./Messages";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import { formatLastSeen } from "../../utils/formatLastSeen";
import EmojiPicker from "emoji-picker-react";
import useSendMessage from "../../hooks/useSendMessage";
import { BsSend } from "react-icons/bs";
import useListenTyping from "../../hooks/useListenTyping";

function MessageContainer({ info }) {
  const {
    selectedConversation,
    setSelectedConversation,
    Updatedconversation,
    setUpdatedConversation,
    toggleMobileUser,
    typingStatus,
  } = useConversation();
  const {
    onlineUsers,
    lastSeen,
    socketLastSeen,
    setSocketLastSeen,
    setLastSeen,
    socket,
  } = useSocketContext();
  const { authUser } = useAuthContext();
  const isOnline = onlineUsers.includes(selectedConversation?._id);

  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const emojiPickerRef = useRef(null); // Reference for emoji picker

  let typingTimeout;

  const handleTyping = () => {
    socket.emit("typing", {
      senderId: authUser._id,
      recipientId: selectedConversation._id,
    });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stop_typing", {
        senderId: authUser._id,
        recipientId: selectedConversation._id,
      });
    }, 3000);
  };

  useEffect(() => {
    if (!socketLastSeen) return;
    if (
      socketLastSeen &&
      socketLastSeen?.userID === selectedConversation?._id
    ) {
      const date = new Date(socketLastSeen.lastSeen);
      const isoString = date.toISOString();
      setLastSeen(isoString);
    }
    setSocketLastSeen("");
  }, [socketLastSeen]);

  useEffect(() => {
    setInputMessage("");
    setLastSeen("");
  }, [selectedConversation?._id]);

  // Close the emoji picker when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false); // Close emoji picker
      }
    };

    // Add event listener to detect clicks outside the emoji picker
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const changeUserList = (lastMessage) => {
    if (!lastMessage) return;
    const filteredConversations = Updatedconversation.filter(
      (chat) => chat._id !== selectedConversation._id
    );
    setSelectedConversation({
      ...selectedConversation,
      lastMessage: inputMessage,
      lastMessageTime: lastMessage?.createdAt,
    });
    const newConversations = [
      {
        ...selectedConversation,
        lastMessage: inputMessage,
        lastMessageTime: lastMessage?.createdAt,
      },
      ...filteredConversations,
    ];
    setUpdatedConversation(newConversations);
    setInputMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage) return;
    const lastMessage = await sendMessage(inputMessage);
    changeUserList(lastMessage);
  };

  const onEmojiClick = (emojiObject) => {
    setInputMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleInputChange = (e) => {
    handleTyping();
    setInputMessage(e.target.value);
  };

  const openChat = () => {
    toggleMobileUser(true);
  };

  return (
    <div className="sm:w-[70%] flex flex-col w-screen chat-screen">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="ps-1 py-2 mb-2 sm:mt-auto mt-[50px] w-90% md:w-[100%] flex items-center justify-between message-box-header">
            <div className="flex items-center ps-2">
              <img
                src={
                  selectedConversation.gender === "male"
                    ? "../../../static/images/boy_img.jpg"
                    : "../../../static/images/girl_img.jpg"
                }
                alt={selectedConversation.fullname}
                className="rounded-full h-10 w-10 mr-2"
              />
              <div>
                <span className="font-bold cursor-pointer" onClick={info}>
                  {selectedConversation.fullname}
                </span>
                <div className="text-sm text-gray-500">
                  {typingStatus
                    ? typingStatus
                    : lastSeen
                    ? isOnline
                      ? "Active"
                      : formatLastSeen(lastSeen)
                    : "Loading.."}
                </div>
              </div>
            </div>
            {/* Additional Info or Actions (if needed) */}
            <div className="flex items-center">
              {/* You can add action buttons like a "Call" button here */}
            </div>
          </div>

          <Messages />
          <form
            className="px-2 py-2 rounded-b-2xl shadow-inner"
            onSubmit={handleSubmit}
          >
            <div className="relative flex items-center">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div
                  className="absolute bottom-12 left-0 z-20"
                  ref={emojiPickerRef}
                >
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}

              {/* Emoji Button */}
              <button
                type="button"
                aria-label="Choose emoji"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xl text-blue-500 transition emoji"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                tabIndex={0}
              >
                😀
              </button>

              {/* Message Input */}
              <input
                type="text"
                className="
                      w-full pl-3 md:pl-10 pr-12 py-2 rounded-lg
                      focus:outline-none 
                      transition placeholder-gray-400 text-sm sm:text-base message-inbox
                    "
                placeholder="Type your message..."
                value={inputMessage}
                onChange={handleInputChange}
                autoComplete="off"
                aria-label="Message"
              />

              {/* Send Button */}
              <button
                type="submit"
                className="
                      absolute right-2 top-1/2 -translate-y-1/2
                      bg-blue-500 text-white rounded-full p-2
                      flex items-center justify-center transition
                      disabled:opacity-60
                    "
                disabled={loading || !inputMessage.trim()}
                aria-label="Send message"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-2 w-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  <BsSend className="h-2 w-2" />
                )}
              </button>
            </div>
          </form>
          <button
            className="w-full py-2 mt-2 bg-blue-500 text-white text-sm font-semibold rounded-md back-chat-btn"
            onClick={openChat}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
}

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center font-semibold flex flex-col items-center gap-2">
        <p>Welcome 🧑‍💻 {authUser.fullname} 💐</p>
        <p>Select a chat to start messaging</p>
      </div>
    </div>
  );
};
