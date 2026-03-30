import React from "react";
import assets from "../../../assets/assets";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import SEO from "../../../components/common/SEO";

export default function TeachingFactoryHero() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 md:p-6 p-6 lg:p-0 lg:pl-26 md:pb-26">
      <SEO
        title={`${t("tefaPage.title")} | NAT`}
        description={t("tefaPage.description")}
        url={window.location.href}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex lg:pt-20"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
          {t("tefaPage.title")}
        </h1>
      </motion.div>

      <div className="max-w-8xl w-full grid lg:grid-cols-2">
        {/* Left Content Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-6"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            {t("tefaPage.subtitle")}
          </h2>

          <p className="py-2 text-gray-700 leading-relaxed md:text-2xl text-lg ">
            {t("tefaPage.description")}
          </p>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative pt-6"
        >
          <div>
            <img
              src={assets.tefaImage}
              alt="Students and professionals in school uniforms"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-300 rounded-full opacity-50 blur-2xl"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-300 rounded-full opacity-40 blur-xl"></div>
        </motion.div>
      </div>
      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex h-80 md:h-50 pt-6"
      >
        <div className="absolute flex flex-wrap pt-6 md:pt-6 lg:pt-0 lg:gap-12 gap-4 md:gap-6">
          <button className="bg-emerald-400 hover:bg-emerald-500 text-white text-md lg:text-xl font-semibold px-6 lg:px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            {t("tefaPage.buttons.certification")}
          </button>

          <button className="bg-emerald-400 hover:bg-emerald-500 text-white text-md lg:text-xl font-semibold px-6 lg:px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            {t("tefaPage.buttons.monitoring")}
          </button>

          <button className="bg-emerald-400 hover:bg-emerald-500 text-white text-md lg:text-xl font-semibold px-6 lg:px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            {t("tefaPage.buttons.projection")}
          </button>

          <button className="bg-emerald-400 hover:bg-emerald-500 text-white text-md lg:text-xl font-semibold px-6 lg:px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            {t("tefaPage.buttons.workshop")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
