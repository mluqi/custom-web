import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import { CheckCircle2 } from "lucide-react";
import assets from "../../../assets/assets";
import SEO from "../../../components/common/SEO";

export default function SistemBilling() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 lg:p-16">
      <SEO
        title={`${t("billingPage.title")} | NAT`}
        description={t("billingPage.description")}
        url={window.location.href}
      />
      <div className="max-w-8xl w-full flex md:flex-row flex-col justify-between mx-auto gap-16 ">
        {/* Left Content Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            {t("billingPage.title")}
          </h1>

          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
            {t("billingPage.subtitle")}
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            {t("billingPage.description")}
          </p>

          <p className="text-gray-700 leading-relaxed text-lg text-justify font-medium">
            {t("billingPage.closing")}
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
            <div className="relative z-10 overflow-hidden ">
              <img
                src={assets.mockupImage}
                alt="Billing System Dashboard"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#b137ab] rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#9464b2] rounded-full opacity-30 blur-2xl"></div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="pt-20"
      >
        <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          {t("billingPage.whyChooseUs")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["service", "billing", "payment", "whatsapp", "operations"].map(
            (key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#b137ab] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                      {t(`billingPage.features.${key}`)}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t(`billingPage.featureDetails.${key}`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </motion.div>
    </div>
  );
}
