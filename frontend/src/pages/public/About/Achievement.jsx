import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Flag,
  Building2,
  Rocket,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Trophy,
  Award,
  Star,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import api from "../../../services/api";
import SEO from "../../../components/common/SEO";

const Achievement = () => {
  const { t, language } = useLanguage();
  const [achievements, setAchievements] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [achievementsRes, settingsRes] = await Promise.all([
          api.get("/achievement"),
          api.get("/settings/public"),
        ]);

        setAchievements(achievementsRes.data);
        setSiteSettings(settingsRes.data);

        if (settingsRes.data.achievement_stats) {
          try {
            setStatsData(JSON.parse(settingsRes.data.achievement_stats));
          } catch (e) {
            console.error("Error parsing stats:", e);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
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

  // Helper untuk label stats yang mungkin object (i18n) atau string (legacy)
  const getLocalizedLabel = (label) => {
    if (typeof label === "object" && label !== null) {
      return label[language] || label.id || label.en || "";
    }
    return label;
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

  const getIcon = (iconName) => {
    const className = "w-8 h-8";
    switch (iconName) {
      case "Trophy":
        return <Trophy className={`${className} text-yellow-500`} />;
      case "Award":
        return <Award className={`${className} text-accent`} />;
      case "Star":
        return <Star className={`${className} text-orange-500`} />;
      case "TrendingUp":
        return <TrendingUp className={`${className} text-blue-500`} />;
      case "MapPin":
        return <MapPin className={`${className} text-accent`} />;
      case "Flag":
        return <Flag className={`${className} text-yellow-500`} />;
      case "Rocket":
        return <Rocket className={`${className} text-orange-500`} />;
      case "Building2":
        return <Building2 className={`${className} text-indigo-500`} />;
      case "Calendar":
        return <Calendar className={`${className} text-green-500`} />;
      case "Users":
        return <Users className={`${className} text-purple-500`} />;
      default:
        return <Trophy className={`${className} text-gray-500`} />;
    }
  };

  // Fallback stats jika data belum ada di DB
  const defaultStats = [
    {
      label: t("achievementPage.stats.experience"),
      value: "2020",
      icon: "Calendar",
    },
    {
      label: t("achievementPage.stats.awards"),
      value: "5",
      icon: "Building2",
    },
    {
      label: t("achievementPage.stats.customers"),
      value: "50k+",
      icon: "Users",
    },
    {
      label: t("achievementPage.stats.coverage"),
      value: "4 Kota",
      icon: "MapPin",
    },
  ];

  const displayStats = statsData.length > 0 ? statsData : defaultStats;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <SEO
        title={`${t("achievementPage.title")} | NAT`}
        description={t("achievementPage.subtitle")}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {getLocalizedSetting("achievement_header_title") ||
              t("achievementPage.title")}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {getLocalizedSetting("achievement_header_desc") ||
              t("achievementPage.subtitle")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {displayStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent">
                {typeof stat.icon === "string" ? getIcon(stat.icon) : stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">
                {getLocalizedLabel(stat.label)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Section */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block"></div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
            </div>
          ) : (
            <div className="space-y-12">
              {achievements.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`flex flex-col md:flex-row gap-8 items-center ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Side */}
                  <div className="flex-1 w-full">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow relative">
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-50 p-3 rounded-2xl shrink-0">
                          {getIcon(item.icon)}
                        </div>
                        <div>
                          <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold mb-2">
                            {item.year}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {getLocalized(item.title)}
                          </h3>
                          <p className="text-sm text-accent font-medium mb-3">
                            {getLocalized(item.issuer)}
                          </p>
                          <p className="text-gray-600 leading-relaxed">
                            {getLocalized(item.description)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Center Point (Desktop Only) */}
                  <div className="w-4 h-4 bg-accent rounded-full border-4 border-white shadow-sm z-10 hidden md:block shrink-0"></div>

                  {/* Empty Side for Balance */}
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievement;
