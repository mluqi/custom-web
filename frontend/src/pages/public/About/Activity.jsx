import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import api from "../../../services/api";
import SEO from "../../../components/common/SEO";

const Activity = () => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activities, setActivities] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const categoryKeys = ["all", "CSR", "Internal", "Workshop", "Sponsorship"];

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== "all") {
          params.category = activeCategory;
        }
        const response = await api.get("/activity", { params });
        setActivities(response.data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [activeCategory]);

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

  // Helper untuk mengambil konten sesuai bahasa
  const getLocalized = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

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

  // Helper untuk URL gambar
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/600x400?text=No+Image";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `${baseUrl}/uploads/${img}`;
  };

  // Helper untuk strip HTML tags dari deskripsi (untuk preview card)
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <SEO
        title={`${activeCategory !== "all" ? `${activeCategory} - ` : ""}${t("activityPage.title")} | NAT`}
        description={t("activityPage.subtitle")}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {getLocalizedSetting("activity_header_title") ||
              t("activityPage.title")}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {getLocalizedSetting("activity_header_desc") ||
              t("activityPage.subtitle")}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-4">
          <div className="bg-white p-1.5 rounded-full shadow-sm flex gap-2">
            {categoryKeys.map((catKey) => (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  activeCategory === catKey
                    ? "bg-accent text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t(`activityPage.categories.${catKey.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {activities.map((activity) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={activity.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden shrink-0">
                  <img
                    src={getImageUrl(activity.image)}
                    width="400"
                    height="224"
                    loading="lazy"
                    decoding="async"
                    alt={getLocalized(activity.title)}
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-accent shadow-sm">
                      {activity.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(activity.date).toLocaleDateString(
                          language === "id" ? "id-ID" : "en-US",
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3" />
                      <span>{activity.location}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    {getLocalized(activity.title)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {stripHtml(getLocalized(activity.description))}
                  </p>
                  <Link
                    to={`/activity/${activity.id}`}
                    className="text-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto"
                  >
                    {t("activityPage.readMore")}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && activities.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">{t("activityPage.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
