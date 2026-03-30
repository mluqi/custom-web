import React, { useEffect, useState } from "react";
import assets from "../../../assets/assets";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import api from "../../../services/api";
import CardLayanan from "../../../components/common/CardLayanan";
import { Loader2 } from "lucide-react";
import SEO from "../../../components/common/SEO";

export default function IPTVPalindo() {
  const { t, language } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactPhone, setContactPhone] = useState("62811578511");
  const [waMessageSubscribe, setWaMessageSubscribe] = useState(null);
  const [waMessageAsk, setWaMessageAsk] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [packagesRes, settingsRes] = await Promise.all([
          api.get("/service-packages?category=combo"),
          api.get("/settings/public"),
        ]);
        setData(packagesRes.data);
        if (settingsRes.data.contact_phone) {
          setContactPhone(
            settingsRes.data.contact_phone.replace(/[^0-9]/g, ""),
          );
        }
        if (settingsRes.data.whatsapp_message_subscribe) {
          setWaMessageSubscribe(settingsRes.data.whatsapp_message_subscribe);
        }
        if (settingsRes.data.whatsapp_message_ask) {
          setWaMessageAsk(settingsRes.data.whatsapp_message_ask);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getLocalized = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 lg:p-16">
      <SEO
        title={`${t("iptvPage.title")} | NAT`}
        description={t("iptvPage.p1")}
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
            {t("iptvPage.title")}
          </h1>

          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
            {t("iptvPage.subtitle")}
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            {t("iptvPage.p1")}
          </p>

          <p className="text-gray-700 leading-relaxed text-lg text-justify">
            {t("iptvPage.p2")}
          </p>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          {/* IPTV Box and Remote Container */}
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl opacity-60 scale-110"></div>

            {/* IPTV Box Image */}
            <div className="relative z-10">
              <img
                src={assets.iptvImage}
                alt="IPTV Set-top Box with Remote"
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
        className="flex flex-wrap gap-4 pt-6"
      >
        <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("iptvPage.buttons.hd")}
        </button>

        <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("iptvPage.buttons.channels")}
        </button>

        <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("iptvPage.buttons.vod")}
        </button>

        <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("iptvPage.buttons.centralized")}
        </button>

        <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          {t("iptvPage.buttons.stable")}
        </button>
      </motion.div>

      {/* Combo Packages Section */}
      <div className="mt-24 w-full max-w-8xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("iptvPage.layanantitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("iptvPage.layanansubtitle")}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((pkg, index) => (
              <motion.div
                key={pkg.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CardLayanan
                  image={
                    pkg.image
                      ? pkg.image.startsWith("http")
                        ? pkg.image
                        : `${baseUrl}/uploads/${pkg.image}`
                      : "https://placehold.co/600x400?text=No+Image"
                  }
                  title={getLocalized(pkg.title)}
                  speed={pkg.speed}
                  price={pkg.price}
                  originalPrice={pkg.original_price}
                  discount={getLocalized(pkg.discount)}
                  discountNote={getLocalized(pkg.discount_note)}
                  isHighlighted={pkg.is_highlighted}
                  contactPhone={contactPhone}
                  waMessageSubscribe={waMessageSubscribe}
                  waMessageAsk={waMessageAsk}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
