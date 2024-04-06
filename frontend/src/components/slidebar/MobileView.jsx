import React, { useState } from "react";
import Slidebar from "./Slidebar";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import { TiMessages } from "react-icons/ti";

function MobileView() {
    const [toggle, setToggle] = useState(false);

  return (
    <>
      <div className="block sm:hidden absolute bg-pink-900 px-5 py-2 text-white rounded flex gap-3" onClick={() => setToggle(true)}>
        Chats with
        <TiMessages className='text-2xl md:text-6xl text-center' />
      </div>
      <div className={`h-[88vh] mt-[45px] sm:hidden z-10 absolute overflow-hidden transition-all 0.3s ease-in-out ${toggle ? "w-[75%] p-4" : "w-0 p-0"}`} onClick={() => setToggle(false)} style={{backgroundColor: "#35374B"}}>
        <SearchInput  />
        <div className='divider px-3'></div>
        <Conversations />
        <LogoutButton />
      </div>
    </>
  );
}

export default MobileView;
