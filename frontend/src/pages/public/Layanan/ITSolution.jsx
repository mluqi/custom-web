import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import SEO from "../../../components/common/SEO";

export default function ITSolution() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 lg:p-16">
      <SEO
        title={`${t("itSolutionPage.title")} | NAT`}
        description={t("itSolutionPage.p1")}
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
            {t("itSolutionPage.title")}
          </h1>

          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
            {t("itSolutionPage.subtitle")}
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            {t("itSolutionPage.p1")}
          </p>

          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            {t("itSolutionPage.p2")}
          </p>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          {/* Image Container */}
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl opacity-60 scale-110"></div>

            {/* Image */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="IT Solution Services"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#b137ab] rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#9464b2] rounded-full opacity-30 blur-2xl"></div>
        </motion.div>
      </div>
      {/* Feature Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap gap-4 pt-16"
      >
        <button className="bg-[#b137ab] hover:bg-[#942b8f] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("itSolutionPage.buttons.infrastructure")}
        </button>

        <button className="bg-[#b137ab] hover:bg-[#942b8f] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("itSolutionPage.buttons.hardware")}
        </button>

        <button className="bg-[#b137ab] hover:bg-[#942b8f] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("itSolutionPage.buttons.maintenance")}
        </button>

        <button className="bg-[#b137ab] hover:bg-[#942b8f] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("itSolutionPage.buttons.consultant")}
        </button>
      </motion.div>
    </div>
  );
}
