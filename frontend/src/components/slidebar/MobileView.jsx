import React, { useState } from "react";
import Slidebar from "./Slidebar";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../zustand/useConversation";

function MobileView() {
  const { mobileUser }= useConversation()

  return (
    <>
      {/* <div
        className="block sm:hidden absolute px-3 py-1 rounded flex gap-3 mobile-view-chat-option"
        onClick={openChat}
      >
        Chats with
        <TiMessages className="text-2xl md:text-6xl text-center" />
      </div> */}

      {mobileUser && (
        <div
          className={`mt-[45px] sm:hidden z-10 absolute overflow-hidden transition-all 0.3s ease-in-out mobile-view-conversation`}
        >
          <SearchInput />
          {/* <div className="divider px-3"></div> */}
          <Conversations />
        </div>
      )}
    </>
  );
}

export default MobileView;
