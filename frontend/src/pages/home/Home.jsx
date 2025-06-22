import React, { useState, useEffect } from "react";
import Slidebar from "../../components/slidebar/Slidebar";
import MessageContainer from "../../components/messages/MessageContainer";
import MobileView from "../../components/slidebar/MobileView";
import About from "../../components/about/About";
import useConversation from "../../zustand/useConversation";
import EditOwnData from "../../components/editOwnData/EditOwnData";
import NetworkStatus from "../network/NetworkStatus";
import useGetConversations from "../../hooks/useGetConversations";
import WelcomeScreen from "./WelcomeScreen";

function Home() {
  const [clickedOnAbout, setClickedOnAbout] = useState(false);
  const { destination } = useConversation();
  const clickAboutFun = () => {
    setClickedOnAbout((pre) => !pre);
  };
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const { loading } = useGetConversations();
  return (
    <>
      <div className="flex h-full w-full rounded-lg overflow-hidden bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 home">
        <NetworkStatus />
        {showWelcome && (
          <WelcomeScreen onFinish={() => setShowWelcome(false)} />
        )}
        <MobileView />
        <Slidebar />
        {destination === "editOwnData" ? (
          <EditOwnData />
        ) : clickedOnAbout ? (
          <About back={clickAboutFun} />
        ) : (
          <MessageContainer info={clickAboutFun} />
        )}
      </div>
    </>
  );
}

export default Home;
