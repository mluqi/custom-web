import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import api from "../../services/api";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("62811578511");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/public");
        if (response.data.contact_phone) {
          setPhoneNumber(response.data.contact_phone.replace(/[^0-9]/g, ""));
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      className={`fixed bottom-8 right-24 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></span>
        <a
          href={`https://wa.me/${phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative p-3 rounded-full bg-green-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};

export default WhatsAppButton;
