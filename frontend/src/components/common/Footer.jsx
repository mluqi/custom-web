import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import assets from "../../assets/assets";
import { useLanguage } from "../../contexts/LanguageContext";
import api from "../../services/api";

const Footer = () => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/public");
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch footer settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Helper untuk mengambil teks sesuai bahasa (jika formatnya JSON string)
  const getLocalizedValue = (key, fallback) => {
    if (!settings || !settings[key]) return fallback;
    try {
      const parsed = JSON.parse(settings[key]);
      return parsed[language] || parsed.id || parsed.en || fallback;
    } catch (e) {
      return settings[key]; // Jika bukan JSON (data lama), kembalikan string langsung
    }
  };

  // Helper untuk parse JSON link dengan aman
  const getLinks = (key, defaultLinks) => {
    if (settings && settings[key]) {
      try {
        return JSON.parse(settings[key]);
      } catch (e) {
        console.error("Error parsing footer links:", e);
        return defaultLinks;
      }
    }
    return defaultLinks;
  };

  const footerSections = [
    {
      title: t("footer.business"),
      links: getLinks("footer_business_links", [
        { label: t("footer.whyUs"), href: "/about-us" },
        { label: t("footer.services"), href: "/internet" },
        { label: t("footer.iot"), href: "/it-solution" },
        { label: t("footer.support"), href: "/internet-business" },
        { label: t("footer.update"), href: "/blog" },
        { label: t("footer.partner"), href: "/contact" },
      ]),
    },
    {
      title: t("footer.company"),
      links: getLinks("footer_company_links", [
        { label: t("footer.ourCompany"), href: "/about-us" },
        { label: t("footer.media"), href: "/" },
        { label: t("footer.csr"), href: "/activity" },
        {
          label: t("footer.career"),
          href: "/career",
          badge: t("footer.hiring"),
        },
      ]),
    },
    {
      title: t("footer.care"),
      links: getLinks("footer_care_links", [
        { label: t("footer.privacy"), href: "/privacy-policy" },
        { label: t("footer.coverage"), href: "/internet-home" },
      ]),
    },
  ];

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      text: settings?.contact_phone || "+62 811-578-511",
      href: `tel:${(settings?.contact_phone || "+62 811578511").replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      text: settings?.contact_email || "info@naomiaurora.com",
      href: `mailto:${settings?.contact_email || "info@naomiaurora.com"}`,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      text:
        settings?.contact_address ||
        "Jalan Raya, Sungai Purun Besar, Kecamatan Segedong, Kabupaten Mempawah",
      href:
        settings?.contact_map_link ||
        "https://maps.google.com/?q=Kabupaten+Mempawah,+Kalimantan+Barat",
      target: "_blank",
    },
  ];

  const socialMedia = [
    {
      icon: <FaFacebook className="w-5 h-5" />,
      href: settings?.social_facebook,
      name: "Facebook",
      color: "hover:bg-[#1877F2]",
    },
    {
      icon: <FaInstagram className="w-5 h-5" />,
      href: settings?.social_instagram,
      name: "Instagram",
      color:
        "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737]",
    },
    {
      icon: <FaTiktok className="w-5 h-5" />,
      href: settings?.social_tiktok,
      name: "TikTok",
      color: "hover:bg-black",
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      href: settings?.social_linkedin,
      name: "LinkedIn",
      color: "hover:bg-[#0A66C2]",
    },
    {
      icon: <FaYoutube className="w-5 h-5" />,
      href: settings?.social_youtube,
      name: "YouTube",
      color: "hover:bg-[#FF0000]",
    },
  ].filter((item) => item.href);

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 lg:pt-24 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <Link to="/" className="inline-block">
                <img
                  src={
                    settings?.site_logo
                      ? settings.site_logo.startsWith("http")
                        ? settings.site_logo
                        : `${baseUrl}/uploads/${settings.site_logo}`
                      : assets.logo
                  }
                  alt="NAT Logo"
                  className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
                {getLocalizedValue(
                  "footer_description",
                  t("footer.description"),
                )}
              </p>
            </div>

            <div className="space-y-5">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target={item.target}
                  rel={item.target ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 shrink-0 border border-gray-700/50 group-hover:border-accent">
                    {item.icon}
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
                      {item.icon.type === MapPin
                        ? getLocalizedValue("contact_address", item.text)
                        : item.text}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-8 lg:pl-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
              {footerSections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
                    {section.title}
                    <span className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded-full"></span>
                  </h3>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <FooterLink link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} PT Naomi Aurora Teknologi.{" "}
              {t("footer.rights")}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm font-medium hidden sm:block">
                {t("footer.follow")}
              </span>
              <div className="flex gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-white hover:-translate-y-1 hover:shadow-lg ${social.color}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ link }) => {
  const { language } = useLanguage();

  // Handle label jika berbentuk object (multibahasa)
  let label = link.label;
  if (typeof label === "object" && label !== null) {
    label = label[language] || label.id || label.en || "";
  }

  const content = (
    <>
      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-accent transition-colors"></span>
      <span className="group-hover:translate-x-1 transition-transform duration-300">
        {label}
      </span>
      {link.badge && (
        <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-red-500 rounded-full animate-pulse">
          {link.badge}
        </span>
      )}
    </>
  );

  const className =
    "flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors group w-fit font-medium";

  if (link.href.startsWith("/")) {
    return (
      <Link to={link.href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  );
};

export default Footer;
