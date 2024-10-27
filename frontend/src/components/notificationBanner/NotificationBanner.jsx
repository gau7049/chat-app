import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";

const NotificationBanner = ({ message, preview, onClick, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`notification-banner ${isFadingOut ? "fade-out" : "slide-in"} bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer transition-opacity duration-300`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="mr-3 animate-pulse">
          <FaEnvelope className="w-6 h-6 text-white opacity-90" />
        </div>
        <div>
          <p className="font-semibold text-lg">{message}</p>
          {preview && <p className="text-sm text-gray-200 opacity-90">{preview}</p>}
        </div>
      </div>
      <button
        className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          setIsFadingOut(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose();
          }, 300);
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationBanner;
