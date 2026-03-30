import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Search, Globe, Menu, X } from "lucide-react";
import flagIcons from "../../assets/flagIcons";
import assets from "../../assets/assets";
import { useLanguage } from "../../contexts/LanguageContext";
import api from "../../services/api";

const Navbar = () => {
  const location = useLocation();
  const { language, changeLanguage, t } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState(assets.logo);
  const [dynamicServices, setDynamicServices] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, servicesRes] = await Promise.all([
          api.get("/settings/public"),
          api.get("/dynamic-services"),
        ]);

        if (settingsRes.data.site_logo) {
          setLogoUrl(
            settingsRes.data.site_logo.startsWith("http")
              ? settingsRes.data.site_logo
              : `${baseUrl}/uploads/${settingsRes.data.site_logo}`,
          );
        }
        setDynamicServices(servicesRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLocalizedTitle = (title) => {
    if (!title) return "";
    if (typeof title === "string") return title;
    return title[language] || title.id || title.en || "";
  };

  const menuItems = [
    { label: t("navbar.home"), hasDropdown: false, path: "/" },
    {
      label: t("navbar.services"),
      hasDropdown: true,
      path: "/layanan",
      dropdownItems: [
        { label: t("navbar.palindoHome"), path: "/internet-home" },
        ...dynamicServices.map((service) => ({
          label: getLocalizedTitle(service.title),
          path: `/services/${service.slug}`,
        })),
      ],
    },
    { label: t("navbar.promo"), hasDropdown: false, path: "/promo" },
    { label: t("navbar.internet"), hasDropdown: false, path: "/internet" },
  ];

  const topLinks = [
    { label: t("navbar.articles"), href: "/blog" },
    { label: t("navbar.contact"), href: "/contact" },
    { label: t("navbar.about"), href: "/about-us" },
  ];

  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

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
  };

  return (
    <nav className="w-full bg-white shadow-sm lg:py-2 sticky top-0 z-50">
      {/* Top Bar */}
      <div
        className={`hidden md:block transition-all duration-300 ease-in-out overflow-hidden ${
          isScrolled
            ? "max-h-0 opacity-0"
            : "max-h-12 opacity-100 border-b border-gray-100"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-10 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex gap-6">
                {topLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.href}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between md:justify-start items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={logoUrl}
                fetchPriority="high"
                alt="LogoPalindo"
                width="150"
                height="48"
                className="h-10 md:h-12 lg:h-14 w-auto"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8 mx-auto">
            {menuItems.map((item, idx) => {
              const isDropdownActive =
                item.hasDropdown &&
                (location.pathname === item.path ||
                  item.dropdownItems?.some(
                    (subItem) => subItem.path === location.pathname,
                  ));

              return (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() =>
                    item.hasDropdown && setActiveDropdown(idx)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.hasDropdown ? (
                    <button
                      className={`flex items-center gap-1 font-medium transition-colors py-2 text-sm lg:text-base ${
                        isDropdownActive
                          ? "text-accent"
                          : "text-gray-900 hover:text-accent"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-1 font-medium transition-colors py-2 text-sm lg:text-base ${
                          isActive
                            ? "text-accent"
                            : "text-gray-900 hover:text-accent"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                  {item.hasDropdown && activeDropdown === idx && (
                    <div className="absolute top-full left-0 pt-2 w-48 z-50">
                      <div className="bg-white rounded-lg shadow-lg py-2">
                        {item.dropdownItems?.map((subItem, subIdx) =>
                          subItem.path.startsWith("http") ? (
                            <a
                              key={subIdx}
                              href={subItem.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block border-b border-gray-100 px-4 py-2 hover:bg-gray-50 hover:text-accent transition-colors text-gray-700"
                            >
                              {subItem.label}
                            </a>
                          ) : (
                            <Link
                              key={subIdx}
                              to={subItem.path}
                              className={`block border-b border-gray-100 px-4 py-2 hover:bg-gray-50 hover:text-accent transition-colors ${
                                location.pathname === subItem.path
                                  ? "text-accent"
                                  : "text-gray-700"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Language Selector (Desktop) */}
          <div className="hidden md:relative md:flex items-center">
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              aria-label="Select Language"
            >
              {selectedLanguage.icon()}
              <ChevronDown className="w-4 h-4" />
            </button>
            {languageDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                {languages.map((lang) => (
                  <button
                    key={lang.name}
                    onClick={() => handleLanguageSelect(lang)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                  >
                    {lang.icon()} {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {/* Main Menu Items */}
            {menuItems.map((item, idx) => {
              const isDropdownActive =
                item.hasDropdown &&
                (location.pathname === item.path ||
                  item.dropdownItems?.some(
                    (subItem) => subItem.path === location.pathname,
                  ));

              return (
                <div key={idx}>
                  {item.hasDropdown ? (
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === idx ? null : idx)
                      }
                      className={`flex justify-between items-center w-full text-left font-medium py-2 hover:text-accent ${
                        isDropdownActive ? "text-accent" : "text-gray-900"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex justify-between items-center w-full text-left font-medium py-2 ${
                          isActive
                            ? "text-accent"
                            : "text-gray-900 hover:text-accent"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                  {item.hasDropdown && activeDropdown === idx && (
                    <div className="pl-4 flex flex-col gap-2 mt-1 mb-2">
                      {item.dropdownItems?.map((subItem, subIdx) =>
                        subItem.path.startsWith("http") ? (
                          <a
                            key={subIdx}
                            href={subItem.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 hover:text-accent text-gray-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </a>
                        ) : (
                          <Link
                            key={subIdx}
                            to={subItem.path}
                            className={`py-1 hover:text-accent ${
                              location.pathname === subItem.path
                                ? "text-accent"
                                : "text-gray-600"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile Top Links Dropdown */}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "toplinks" ? null : "toplinks",
                  )
                }
                className={`flex justify-between items-center w-full text-left font-medium py-2 hover:text-accent ${
                  activeDropdown === "toplinks"
                    ? "text-accent"
                    : "text-gray-900"
                }`}
              >
                {t("navbar.topLinks")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === "toplinks" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "toplinks" && (
                <div className="pl-4 flex flex-col gap-2 mt-1 mb-2">
                  {topLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1 text-gray-600 hover:text-accent block"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Language Dropdown */}
            <div className="border-t border-gray-100 pt-2">
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "language" ? null : "language",
                  )
                }
                className={`flex justify-between items-center w-full text-left font-medium py-2 hover:text-accent ${
                  activeDropdown === "language"
                    ? "text-accent"
                    : "text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedLanguage.icon()}
                  {selectedLanguage.name}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === "language" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "language" && (
                <div className="pl-4 flex flex-col gap-2 mt-1 mb-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageSelect(lang);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 py-1 w-full text-left hover:text-accent ${
                        language === lang.code
                          ? "text-accent font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {lang.icon()} {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
