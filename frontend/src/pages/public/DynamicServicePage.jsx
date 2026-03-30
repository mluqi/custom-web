import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import api from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import SEO from "../../components/common/SEO";

const DynamicServicePage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/dynamic-services/${slug}`);
        setService(res.data);
      } catch (err) {
        console.error("Service not found");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  const getLocalized = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/800x600?text=No+Image";
    if (img.startsWith("http")) return img;
    return `${baseUrl}/uploads/${img}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin w-10 h-10 text-accent" />
      </div>
    );
  if (!service)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Layanan tidak ditemukan
      </div>
    );

  // --- TEMPLATE 1: WifiHotspot Style (Gradient BG, Text Left, Image Right, Features as Buttons) ---
  if (service.template === "template1") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col p-8 lg:p-16 pt-32">
        <SEO
          title={getLocalized(service.seo_title) || getLocalized(service.title)}
          description={getLocalized(service.seo_description)}
          url={window.location.href}
        />

        <div className="max-w-8xl w-full space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
          >
            {getLocalized(service.title)}
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
                {getLocalized(service.subtitle)}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {getLocalized(service.description)}
              </p>
              {service.content?.p1 && (
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {getLocalized(service.content.p1)}
                </p>
              )}
              {service.content?.p2 && (
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {getLocalized(service.content.p2)}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <img
                src={getImageUrl(service.image)}
                alt={getLocalized(service.title)}
                className="w-full h-auto rounded-3xl shadow-2xl object-cover"
              />
            </motion.div>
          </div>

          {/* Features as Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 pt-6"
          >
            {service.features?.map((feat, idx) => (
              <div
                key={idx}
                className="bg-[#b137ab] text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform cursor-default"
              >
                {getLocalized(feat.title)}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  // --- TEMPLATE 2: InternetBusiness Style (Hero BG, Content Section, List Features) ---
  if (service.template === "template2") {
    return (
      <div className="min-h-screen bg-white">
        <SEO
          title={getLocalized(service.seo_title) || getLocalized(service.title)}
          description={getLocalized(service.seo_description)}
          url={window.location.href}
        />

        {/* Hero */}
        <div className="relative bg-secondary text-white py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={getImageUrl(service.image)}
              alt="Background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {getLocalized(service.title)}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                {getLocalized(service.description)}
              </p>
              <Link
                to={service.cta_link || "/contact"}
                className="bg-accent hover:brightness-90 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-accent/30 inline-block"
              >
                {getLocalized(service.cta_text) || "Hubungi Kami"}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {getLocalized(service.subtitle)}
              </h2>
              <div className="prose prose-lg text-gray-600 mb-8">
                {service.content?.p1 && (
                  <p className="mb-4">{getLocalized(service.content.p1)}</p>
                )}
                {service.content?.p2 && (
                  <p>{getLocalized(service.content.p2)}</p>
                )}
              </div>
              <div className="space-y-4">
                {service.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <span className="text-gray-900 font-bold block">
                        {getLocalized(feat.title)}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {getLocalized(feat.description)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={getImageUrl(service.secondary_image || service.image)}
                  alt="Service"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // --- TEMPLATE 4: Feature Grid (Corporate Style) ---
  if (service.template === "template4") {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO
          title={getLocalized(service.seo_title) || getLocalized(service.title)}
          description={getLocalized(service.seo_description)}
          url={window.location.href}
        />

        {/* Header */}
        <div className="bg-white pb-32 pt-32 px-4 sm:px-6 lg:px-8 rounded-b-[3rem] shadow-sm">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              {getLocalized(service.title)}
            </motion.h1>
            <p className="text-xl text-gray-600">
              {getLocalized(service.subtitle)}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl overflow-hidden shadow-2xl mb-16 bg-gray-200"
          >
            <img
              src={getImageUrl(service.image)}
              alt={getLocalized(service.title)}
              className="w-full h-[300px] md:h-[500px] object-cover"
            />
          </motion.div>

          {/* Content & Features */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Overview
              </h2>
              <div className="prose prose-lg text-gray-600 mb-12">
                <p>{getLocalized(service.description)}</p>
                {service.content?.p1 && (
                  <p>{getLocalized(service.content.p1)}</p>
                )}
                {service.content?.p2 && (
                  <p>{getLocalized(service.content.p2)}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {service.features?.map((feat, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {getLocalized(feat.title)}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {getLocalized(feat.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-lg sticky top-32 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Tertarik dengan layanan ini?
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Dapatkan penawaran terbaik untuk kebutuhan Anda sekarang juga.
                </p>
                <Link
                  to={service.cta_link || "/contact"}
                  className="block w-full py-3 px-4 bg-gray-900 text-white text-center rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  {getLocalized(service.cta_text) || "Hubungi Kami"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TEMPLATE 5: Dark Tech (Modern Dark Theme) ---
  if (service.template === "template5") {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-24">
        <SEO
          title={getLocalized(service.seo_title) || getLocalized(service.title)}
          description={getLocalized(service.seo_description)}
          url={window.location.href}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-accent font-bold tracking-wider uppercase mb-4 text-sm">
                {getLocalized(service.subtitle)}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {getLocalized(service.title)}
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed border-l-2 border-accent pl-6">
                {getLocalized(service.description)}
              </p>
              <Link
                to={service.cta_link || "/contact"}
                className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
              >
                {getLocalized(service.cta_text) || "Get Started"}{" "}
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full"></div>
              <img
                src={getImageUrl(service.image)}
                alt={getLocalized(service.title)}
                className="relative z-10 rounded-2xl shadow-2xl border border-white/10 w-full"
              />
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {service.features?.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-xl font-bold mb-3 text-accent">
                  {getLocalized(feat.title)}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {getLocalized(feat.description)}
                </p>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto text-center pb-20">
            <div className="prose prose-lg prose-invert mx-auto text-gray-300">
              {service.content?.p1 && <p>{getLocalized(service.content.p1)}</p>}
              {service.content?.p2 && <p>{getLocalized(service.content.p2)}</p>}
            </div>
            {service.secondary_image && (
              <img
                src={getImageUrl(service.secondary_image)}
                alt="Detail"
                className="w-full rounded-2xl mt-12 border border-white/10 shadow-2xl"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- TEMPLATE 3: Modern Split (Replacement for Simple) ---
  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <SEO
        title={getLocalized(service.seo_title) || getLocalized(service.title)}
        description={getLocalized(service.seo_description)}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sticky Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-6">
                {getLocalized(service.subtitle)}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {getLocalized(service.title)}
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {getLocalized(service.description)}
              </p>
              <Link
                to={service.cta_link || "/contact"}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-accent hover:brightness-90 md:py-4 md:text-lg shadow-lg shadow-accent/30 transition-all"
              >
                {getLocalized(service.cta_text) || "Hubungi Kami"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Scrollable Content */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={getImageUrl(service.image)}
                alt={getLocalized(service.title)}
                className="w-full rounded-3xl shadow-xl mb-8"
              />

              <div className="prose prose-lg text-gray-600 max-w-none">
                {service.content?.p1 && (
                  <p>{getLocalized(service.content.p1)}</p>
                )}
                {service.content?.p2 && (
                  <p>{getLocalized(service.content.p2)}</p>
                )}
              </div>

              {service.features?.length > 0 && (
                <div className="mt-12 grid sm:grid-cols-2 gap-6">
                  {service.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
                    >
                      <h3 className="font-bold text-gray-900 mb-2">
                        {getLocalized(feat.title)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getLocalized(feat.description)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {service.secondary_image && (
                <img
                  src={getImageUrl(service.secondary_image)}
                  alt="Detail"
                  className="w-full rounded-3xl shadow-lg mt-8"
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicServicePage;
