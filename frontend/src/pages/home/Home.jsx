import React, { useState } from "react";
import Slidebar from "../../components/slidebar/Slidebar";
import MessageContainer from "../../components/messages/MessageContainer";
import MobileView from "../../components/slidebar/MobileView";
import About from "../../components/about/About";
import useConversation from "../../zustand/useConversation";
import EditOwnData from "../../components/editOwnData/EditOwnData";

function Home() {
  const [clickedOnAbout, setClickedOnAbout] = useState(false);
  const { destination } = useConversation();
  const clickAboutFun = () => {
    setClickedOnAbout(pre => !pre)
  }
  return (
    <div className='flex h-full w-full rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      <MobileView />
      <Slidebar />
      {
        destination === "editOwnData" ? <EditOwnData />  : clickedOnAbout ? <About back={clickAboutFun} /> : <MessageContainer info={clickAboutFun} />
      }
    </div>
  );
}

export default Home;
