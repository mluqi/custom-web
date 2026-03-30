import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import api from "../../../services/api";
import SEO from "../../../components/common/SEO";

const ActivityDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/activity/${id}`);
        setActivity(response.data);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const getLocalized = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/800x600?text=No+Image";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `${baseUrl}/uploads/${img}`; // Pastikan path uploads sesuai dengan backend
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-500">
        <p className="mb-4">Aktivitas tidak ditemukan.</p>
        <Link to="/activity" className="text-accent hover:underline">
          Kembali ke Daftar Aktivitas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <SEO
        title={`${getLocalized(activity.title)} | NAT Activity`}
        description={stripHtml(getLocalized(activity.description)).substring(
          0,
          160,
        )}
        image={getImageUrl(activity.image)}
        url={window.location.href}
        type="article"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        {/* <div className="mb-8">
          <Link
            to="/activity"
            className="inline-flex items-center text-gray-600 hover:text-[#569580] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Aktivitas
          </Link>
        </div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Image */}
          <div className="w-full h-64 md:h-96 relative">
            <img
              src={getImageUrl(activity.image)}
              alt={getLocalized(activity.title)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                {activity.category}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {getLocalized(activity.title)}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>
                    {new Date(activity.date).toLocaleDateString(
                      language === "id" ? "id-ID" : "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{activity.location}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-600">
              <div
                dangerouslySetInnerHTML={{
                  __html: getLocalized(activity.description),
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityDetail;
