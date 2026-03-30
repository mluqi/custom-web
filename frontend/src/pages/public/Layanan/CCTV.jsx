import React from "react";
import assets from "../../../assets/assets";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import SEO from "../../../components/common/SEO";

export default function CCTVServices() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 lg:p-16">
      <SEO
        title={`${t("cctvPage.title")} | NAT`}
        description={t("cctvPage.p1")}
        url={window.location.href}
      />
      <div className="max-w-8xl w-full flex md:flex-row flex-col justify-between mx-auto gap-16">
        {/* Left Content Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            {t("cctvPage.title")}
          </h1>

          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
            {t("cctvPage.subtitle")}
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            {t("cctvPage.p1")}
          </p>

          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            {t("cctvPage.p2")}
          </p>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          {/* CCTV Camera Image Container */}
          <div className="relative">
            {/* Decorative background circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl opacity-60 scale-110"></div>

            {/* CCTV Camera Image */}
            <div className="relative z-10">
              <img
                src={assets.cctvImage}
                alt="CCTV Security Camera"
                className="w-full h-full drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-emerald-300 rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
        </motion.div>
      </div>
      {/* Feature Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap gap-4 pt-16"
      >
        <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("cctvPage.buttons.monitoring")}
        </button>

        <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("cctvPage.buttons.support")}
        </button>

        <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("cctvPage.buttons.stable")}
        </button>

        <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("cctvPage.buttons.access24")}
        </button>
      </motion.div>
    </div>
  );
}
