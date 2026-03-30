import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Gift, Percent, Loader2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import api from "../../services/api";
import SEO from "../../components/common/SEO";

const PromoCard = ({ promo, index }) => {
  const { t, language } = useLanguage();
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Helper untuk mengambil konten sesuai bahasa
  const getLocalized = (data) => {
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

  const displayImage =
    promo.image &&
    (promo.image.startsWith("http") || promo.image.startsWith("/"))
      ? promo.image
      : promo.image
        ? `${baseUrl}/uploads/${promo.image}`
        : "https://placehold.co/600x400?text=No+Image";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col h-full hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={displayImage}
          alt={getLocalized(promo.title)}
          className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-bold text-accent shadow-lg flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5" />
          {promo.discount}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors line-clamp-2">
            {getLocalized(promo.title)}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {getLocalized(promo.description)}
          </p>
        </div>

        {/* Meta Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Calendar className="w-4 h-4 text-accent" />
            <span>
              {t("promoPage.card.validUntil")}{" "}
              <span className="text-gray-700 font-semibold">
                {promo.formattedDate}
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Promo = () => {
  const { t, language } = useLanguage();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState({});

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await api.get("/promos?active_only=true");
        const formattedPromos = response.data.map((promo) => ({
          ...promo,
          formattedDate: promo.valid_until
            ? new Date(promo.valid_until).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Selamanya",
        }));
        setPromos(formattedPromos);
      } catch (error) {
        console.error("Failed to fetch promos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/public");
        setSiteSettings(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  const getLocalizedSetting = (key, defaultVal = "") => {
    const val = siteSettings[key];
    if (!val) return defaultVal;
    try {
      const parsed = JSON.parse(val);
      return parsed[language] || parsed.id || parsed.en || defaultVal;
    } catch (e) {
      return val || defaultVal;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${t("promoPage.hero.title1")} ${t("promoPage.hero.title2")} | NAT Promo`}
        description={t("promoPage.hero.subtitle")}
        url={window.location.href}
      />
      {/* Hero Section */}
      <div className="relative bg-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Promo Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 text-white">
              <Gift className="w-4 h-4" />
              <span>{t("promoPage.hero.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {getLocalizedSetting("promo_header_title") ? (
                getLocalizedSetting("promo_header_title")
              ) : (
                <>
                  {t("promoPage.hero.title1")} <br />
                  <span className="text-accent">
                    {t("promoPage.hero.title2")}
                  </span>
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl">
              {getLocalizedSetting("promo_header_desc") ||
                t("promoPage.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Promo Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promos.map((promo, index) => (
              <PromoCard key={promo.id} promo={promo} index={index} />
            ))}
          </div>
        )}

        {!loading && promos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t("promoPage.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promo;
