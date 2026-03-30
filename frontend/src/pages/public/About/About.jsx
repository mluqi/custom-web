/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Lightbulb,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../services/api";
import { useLanguage } from "../../../contexts/LanguageContext";
import SEO from "../../../components/common/SEO";

const AboutUs = () => {
  const sliderRef = useRef(null);
  const { language, t } = useLanguage();
  const [contents, setContents] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [contentRes, teamRes] = await Promise.all([
          api.get("/about/content"),
          api.get("/about/team"),
        ]);

        // Transform content array to object keyed by section
        const contentMap = {};
        contentRes.data.forEach((item) => {
          contentMap[item.section] = item;
        });
        setContents(contentMap);
        setTeamMembers(teamRes.data);
      } catch (error) {
        console.error("Failed to fetch about data:", error);
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

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/250x250?text=Team+Member";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `${baseUrl}/uploads/${img}`;
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = 350;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  const heroSection = contents["hero"];
  const valuesSection = contents["values"];
  const cultureSection = contents["culture"];

  const iconMap = {
    Heart: Heart,
    Lightbulb: Lightbulb,
    Users: Users,
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white pt-32 pb-24">
      <SEO
        title={`${t("aboutPage.seoTitle")} | NAT`}
        description={t("aboutPage.seoDescription")}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {/* ================= HERO ================= */}
        {heroSection && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 whitespace-pre-line">
                {getLocalized(heroSection.title)}
              </h1>

              <Link
                to="/career"
                className="inline-block bg-accent hover:brightness-90 text-white px-8 py-3 rounded-full font-semibold transition"
              >
                {t("aboutPage.heroButton")}
              </Link>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={getImageUrl(heroSection.image)}
                  alt="Hero"
                  width="600"
                  height="450"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </section>
        )}

        {/* ================= VALUES ================= */}
        {valuesSection && (
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {getLocalized(valuesSection.title)}
                </h2>

                <p className="text-gray-600 max-w-lg mb-10">
                  {getLocalized(valuesSection.description)}
                </p>

                <div className="flex gap-10 flex-wrap">
                  {valuesSection.items &&
                    valuesSection.items.map((item, idx) => {
                      const IconComponent = iconMap[item.icon] || Heart;
                      return (
                        <ValueItem
                          key={idx}
                          icon={IconComponent}
                          label={getLocalized(item.label)}
                        />
                      );
                    })}
                </div>
              </motion.div>

              {/* Image Grid */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-6"
              >
                {valuesSection.additional_images &&
                  valuesSection.additional_images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`bg-gray-200 rounded-3xl overflow-hidden ${
                        idx === 0 || idx === 3 ? "h-40" : "h-56"
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Value `}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </motion.div>
            </div>
          </section>
        )}

        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-gray-900 whitespace-pre-line">
              {t("aboutPage.workplaceTitle")}
            </h1>
          </motion.div>
        </section>

        {/* ================= CULTURE ================= */}
        {cultureSection && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-full h-96 bg-gray-200 rounded-3xl overflow-hidden">
                <img
                  src={getImageUrl(cultureSection.image)}
                  alt="Culture"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {getLocalized(cultureSection.title)}
              </h2>

              <p className="text-gray-600 mb-6">
                {getLocalized(cultureSection.description)}
              </p>

              <button className="inline-flex items-center gap-2 bg-accent hover:brightness-90 text-white px-6 py-3 rounded-full font-semibold transition">
                {t("aboutPage.cultureButton")}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </section>
        )}

        {/* ================= TEAM ================= */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t("aboutPage.teamTitle")}
              </h2>
              <Link
                to="/about/team"
                className="text-accent font-medium hover:text-accent/80 inline-flex items-center gap-1 transition-colors"
              >
                {t("aboutPage.viewAllTeam")} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="p-3 rounded-full border border-gray-200 hover:bg-accent/10 hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-3 rounded-full border border-gray-200 hover:bg-accent/10 hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="min-w-[280px] md:min-w-[350px] snap-center"
              >
                <TeamCard
                  name={member.name}
                  role={getLocalized(member.position)}
                  bio={getLocalized(member.bio)}
                  image={getImageUrl(member.image)}
                  noBioText={t("aboutPage.noBio")}
                />
              </div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const ValueItem = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center text-center gap-3">
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-pink-100 text-pink-500">
      <Icon size={26} />
    </div>
    <p className="font-semibold text-gray-800">{label}</p>
  </div>
);

const TeamCard = ({ name, role, bio, image, noBioText }) => (
  <div className="bg-gray-100 rounded-3xl p-6 shadow-sm h-full flex flex-col">
    <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-4">
      {bio || noBioText}
    </p>

    <div className="border-t pt-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        <img
          src={image}
          alt={name}
          width="48"
          height="48"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

export default AboutUs;
