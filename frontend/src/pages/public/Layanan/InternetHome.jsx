import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, Gift, Loader2 } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import CardLayanan from "../../../components/common/CardLayanan";
import SEO from "../../../components/common/SEO";

// Main Palindo Home Page Component
const InternetHome = () => {
  const { t, language } = useLanguage();
  const [packages, setPackages] = useState([]);
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
          api.get("/service-packages", { params: { category: "fiber" } }),
          api.get("/settings/public"),
        ]);
        setPackages(packagesRes.data);
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
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getLocalized = (data) => {
    if (typeof data === "string") return data;
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${t("palindoHome.header.title")} | NAT`}
        description={t("palindoHome.header.p1")}
        url={window.location.href}
      />
      {/* Hero Section */}
      <div className="relative bg-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Home Internet Background"
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
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Wifi className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Home Internet Solution
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t("palindoHome.header.title")}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-6">
              {t("palindoHome.header.p1")}
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              {t("palindoHome.header.p2")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("palindoHome.priceList")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih paket internet rumah yang sesuai dengan kebutuhan digital
              keluarga Anda.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-start">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id || index}
                  initial={{ opacity: 0, y: 50 }}
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

          {/* Promo Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 bg-gradient-to-r from-secondary to-accent rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-8 h-8 text-yellow-300" />
                <h3 className="text-2xl md:text-3xl font-bold">
                  {t("palindoHome.promo.title")}
                </h3>
              </div>
              <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
                {t("palindoHome.promo.description")}
              </p>
              <Link
                to="/promo"
                className="inline-block bg-white text-accent font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                Lihat Semua Promo
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Export both components
export default InternetHome;
