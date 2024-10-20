import React from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import { formatLastSeen } from "../../utils/formatLastSeen";

function MessageContainer({ info }) {
  const { selectedConversation } = useConversation();
  const { onlineUsers, lastSeen } = useSocketContext();
  const isOnline = onlineUsers.includes(selectedConversation?._id);

  return (
    <div className="sm:w-[70%] flex flex-col w-screen">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-500 px-4 py-2 mb-2 sm:mt-auto mt-[40px] w-90% md:w-[100%] flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={selectedConversation.profilePic || "/default-avatar.png"}
                alt={selectedConversation.fullname}
                className="rounded-full h-10 w-10 mr-2"
              />
              <div>
                <span className="font-bold text-white cursor-pointer" onClick={info}>
                  {selectedConversation.fullname}
                </span>
                <div className="text-sm text-gray-300">
                  {
                  isOnline ? "Active" :
                    formatLastSeen(lastSeen)
                }
                </div>
              </div>
            </div>
            {/* Additional Info or Actions (if needed) */}
            <div className="flex items-center">
              {/* You can add action buttons like a "Call" button here */}
            </div>
          </div>

          <Messages />
          <MessageInput />
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
      <div className="px-4 text-center sm:text-lg md:text-xl text-bg-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 🧑‍💻 {authUser.fullname} 💐</p>
        <p>Select a chat to start messaging</p>
      </div>
    </div>
  );
};
