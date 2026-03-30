import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import assets from "../../assets/assets";
import flagIcons from "../../assets/flagIcons";
import { useLanguage } from "../../contexts/LanguageContext";
import api from "../../services/api";

const AboutNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, changeLanguage, t } = useLanguage();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(assets.logo);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/public");
        if (response.data.site_logo) {
          setLogoUrl(
            response.data.site_logo.startsWith("http")
              ? response.data.site_logo
              : `${baseUrl}/uploads/${response.data.site_logo}`,
          );
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      }
    };
    fetchSettings();
  }, []);

  const menuItems = [
    { label: t("navbar.about"), path: "/about-us" },
    { label: t("navbar.career"), path: "/career" },
    { label: t("navbar.activity"), path: "/activity" },
    { label: t("navbar.achievement"), path: "/achievement" },
  ];

  const languages = [
    { code: "id", name: "Indonesia", icon: flagIcons.indonesia },
    { code: "en", name: "English", icon: flagIcons.unitedKingdom },
    { code: "cn", name: "Chinese", icon: flagIcons.china },
  ];

  const selectedLanguage =
    languages.find((l) => l.code === language) || languages[0];

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang.code);
    setLanguageDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full py-4 fixed top-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-full shadow-lg px-6 sm:px-8 flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logoUrl} alt="logoNAT" className="h-8 sm:h-10" />
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden lg:flex items-center gap-8 mx-auto">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `font-semibold transition-colors ${
                    isActive ? "text-accent" : "text-gray-900 hover:text-accent"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Language Selector (Desktop) */}
          <div className="hidden lg:relative lg:flex items-center h-full">
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            >
              {selectedLanguage.icon()}
              <span className="hidden xl:inline">{selectedLanguage.name}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  languageDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {languageDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                      language === lang.code
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {lang.icon()}
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-gray-50 rounded-3xl shadow-lg p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-semibold py-2 transition-colors ${
                      isActive
                        ? "text-accent"
                        : "text-gray-900 hover:text-accent"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
              {/* Language Selector (Mobile) */}
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-gray-500 font-medium">Bahasa</span>
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`p-1.5 rounded-md transition-colors ${
                        language === lang.code
                          ? "bg-white shadow-sm ring-1 ring-accent"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {lang.icon()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AboutNavbar;
