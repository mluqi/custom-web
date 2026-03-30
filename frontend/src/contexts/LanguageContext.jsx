import React, { createContext, useState, useContext, useEffect } from "react";
import { id } from "../locales/id";
import { en } from "../locales/en";
import { cn } from "../locales/cn";

const LanguageContext = createContext();

const translations = { id, en, cn };

export const LanguageProvider = ({ children }) => {
  // Ambil dari localStorage jika ada, default ke 'id'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("appLanguage") || "id";
  });

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem("appLanguage", langCode);
  };

  // Fungsi helper untuk mengambil teks berdasarkan key (contoh: t('navbar.home'))
  const t = (path) => {
    const keys = path.split(".");
    let current = translations[language];

    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(
          `Translation missing for key: ${path} in language: ${language}`
        );
        return path; // Kembalikan key jika tidak ditemukan
      }
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
