import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import SEO from "../../../components/common/SEO";

export default function WiFiHotspotPalindo() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex p-8 lg:p-16">
      <SEO
        title={`${t("wifiPage.title")} | NAT`}
        description={t("wifiPage.p1")}
        url={window.location.href}
      />
      <div className="max-w-8xl w-full space-y-4">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
        >
          {t("wifiPage.title")}
        </motion.h1>

        {/* Subheading */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
            {t("wifiPage.subtitle")}
          </h2>

          {/* First Paragraph */}
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            {t("wifiPage.p1")}
          </p>

          {/* Second Paragraph */}
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            {t("wifiPage.p2")}
          </p>
        </motion.div>

        {/* Subheading 2 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 pt-4">
            {t("wifiPage.subtitle2")}
          </h3>

          {/* Third Paragraph */}
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            {t("wifiPage.p3")}
          </p>
        </motion.div>

        {/* Feature Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap gap-4 pt-6"
        >
          <button className="bg-[#b137ab] hover:bg-[#942b8f] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            {t("wifiPage.buttons.stable")}
          </button>

          <button className="bg-[#b137ab] hover:bg-[#942b8f] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            {t("wifiPage.buttons.integrated")}
          </button>

          <button className="bg-[#b137ab] hover:bg-[#942b8f] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            {t("wifiPage.buttons.flexible")}
          </button>

          <button className="bg-[#b137ab] hover:bg-[#942b8f] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            {t("wifiPage.buttons.secure")}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
