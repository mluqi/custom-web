import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import SEO from "../../components/common/SEO";
import api from "../../services/api";

const Contact = () => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/public");
        setSettings(response.data);

        // Parse locations data
        if (response.data.contact_locations) {
          try {
            const parsedLocations = JSON.parse(response.data.contact_locations);
            setLocations(parsedLocations);
          } catch (e) {
            console.error("Error parsing locations:", e);
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Helper untuk mengambil teks sesuai bahasa
  const getLocalized = (data) => {
    if (typeof data === "object" && data !== null) {
      return data[language] || data.id || data.en || "";
    }
    return data;
  };

  // Fallback jika data belum ada
  const displayLocations =
    locations.length > 0
      ? locations
      : [
          {
            title: { id: "Kantor Operational Segedong" },
            address: { id: "Kab. Mempawah, Kalimantan Barat" },
            mapUrl:
              "https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1sPT+NAOMI+AURORA+TEKNOLOGI!5e0!6i14",
          },
        ];

  const socialMedia = [
    {
      icon: <FaFacebook className="w-6 h-6" />,
      name: "Facebook",
      href: settings?.social_facebook,
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: <FaInstagram className="w-6 h-6" />,
      name: "Instagram",
      href: settings?.social_instagram,
      color: "text-pink-600 bg-pink-50",
    },
    {
      icon: <FaTiktok className="w-6 h-6" />,
      name: "TikTok",
      href: settings?.social_tiktok,
      color: "text-black bg-gray-100",
    },
    {
      icon: <FaWhatsapp className="w-6 h-6" />,
      name: "WhatsApp",
      href: settings?.contact_phone
        ? `https://wa.me/${settings.contact_phone.replace(/[^0-9]/g, "")}`
        : null,
      color: "text-green-500 bg-green-50",
    },
    {
      icon: <FaLinkedin className="w-6 h-6" />,
      name: "LinkedIn",
      href: settings?.social_linkedin,
      color: "text-blue-700 bg-blue-50",
    },
    {
      icon: <FaYoutube className="w-6 h-6" />,
      name: "YouTube",
      href: settings?.social_youtube,
      color: "text-red-600 bg-red-50",
    },
  ].filter((item) => item.href);

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title={`${t("contactPage.title")} | NAT`}
        description={t("contactPage.subtitle")}
        url={window.location.href}
      />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section 1: Contact Info & Social Media */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("contactPage.title")}
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              {t("contactPage.subtitle")}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-2 rounded-lg text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {t("contactPage.phone")}
                  </p>
                  <p className="font-medium text-gray-900">
                    {settings?.contact_phone || "+62 811-578-511"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-2 rounded-lg text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {t("contactPage.email")}
                  </p>
                  <p className="font-medium text-gray-900">
                    {settings?.contact_email || "info@naomiaurora.com"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Social Media */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {t("contactPage.followUs")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-4 rounded-xl transition-transform hover:scale-101 ${social.color}`}
                >
                  <div className="mb-2">{social.icon}</div>
                  <span className="font-medium text-sm text-gray-900">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Section 2: Locations & Map */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Locations List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t("contactPage.locationTitle")}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {t("contactPage.locationSubtitle")}
              </p>

              <div className="space-y-4">
                {displayLocations.map((loc, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedLocation(index)}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer border ${
                      selectedLocation === index
                        ? "bg-accent/5 border-accent/30 shadow-sm"
                        : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    <div className="bg-white p-3 rounded-full shadow-sm text-accent shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {getLocalized(loc.title)}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {getLocalized(loc.address)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-100 rounded-3xl overflow-hidden shadow-lg h-[600px] lg:h-[600px] relative border border-gray-200 sticky top-24"
          >
            <iframe
              src={displayLocations[selectedLocation]?.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map Location"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
