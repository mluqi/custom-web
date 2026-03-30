import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { useLanguage } from "../../../contexts/LanguageContext";
import SEO from "../../../components/common/SEO";

const TeamList = () => {
  const { language, t } = useLanguage();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const response = await api.get("/about/team");
        setTeamMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const getLocalized = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/250x250?text=Team+Member";

    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `${baseUrl}/uploads/${img}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <SEO
        title={`${t("teamPage.seoTitle")} | NAT`}
        description={t("teamPage.seoDescription")}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="mb-8">
          <Link
            to="/about"
            className="inline-flex items-center text-gray-600 hover:text-teal-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Tentang Kami
          </Link>
        </div> */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("teamPage.title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t("teamPage.subtitle")}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={getImageUrl(member.image)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-accent font-medium text-sm">
                        {getLocalized(member.position)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    {getLocalized(member.bio) || t("teamPage.noBio")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamList;
