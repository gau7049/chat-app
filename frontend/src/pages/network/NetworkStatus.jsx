import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online!", { id: "network-status" });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Check your connection.", { id: "network-status" });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    !isOnline && (
      <div className="bg-red-600 text-white p-2 text-center fixed top-0 left-0 right-0 z-50">
        You are currently offline. Please check your internet connection.
      </div>
    )
  );
}

export default NetworkStatus;
