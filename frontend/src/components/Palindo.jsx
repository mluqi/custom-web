import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, ShieldCheck, Headphones } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import assets from "../assets/assets";
import api from "../services/api";

const Palindo = () => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/public");
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const getLocalized = (data, fallback) => {
    if (!data) return fallback;
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      return parsed[language] || parsed.id || parsed.en || fallback;
    } catch {
      return data || fallback;
    }
  };

  const getFeatures = () => {
    if (settings && settings.content_features) {
      try {
        return JSON.parse(settings.content_features);
      } catch (e) {
        return t("palindoSection.features");
      }
    }
    return t("palindoSection.features");
  };

  const features = getFeatures();
  const icons = [
    <Briefcase className="w-6 h-6 text-white" />,
    <ShieldCheck className="w-6 h-6 text-white" />,
    <Headphones className="w-6 h-6 text-white" />,
  ];

  return (
    <section className=" bg-gradient-to-b from-white to-accent/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header Section */}
          <div className="mb-16">
            <div className="mb-4">
              <span className="inline-block text-gray-400 text-xs md:text-sm font-medium tracking-widest uppercase">
                #PilihanTerpercaya #SolusiTerbaik
              </span>
            </div>

            <h2 className="text-3xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {getLocalized(settings?.content_title, t("palindoSection.title"))}
            </h2>

            <p className="text-gray-400 text-md md:text-2xl leading-relaxed max-w-4xl">
              {getLocalized(
                settings?.content_description,
                t("palindoSection.description"),
              )}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start text-left gap-6 p-8 bg-white border-t border-gray-200"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 flex items-center justify-center">
                    {icons[idx] &&
                      React.cloneElement(icons[idx], {
                        className: "w-8 h-8 text-gray-900",
                      })}
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-3">
                    {getLocalized(item.title, item.title)}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {getLocalized(item.description, item.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 top-250 h-100 overflow-hidden">
            <img
              src={assets.waveIcon}
              alt="Decorative Wave"
              width="2834"
              height="948"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover scale-120"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Palindo;
