import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Wifi,
  Zap,
  ShieldCheck,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Building2,
  Home,
  MapPin,
  ChevronDown,
  ChevronUp,
  Globe,
  Rocket,
  Search,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import SEO from "../../components/common/SEO";
import api from "../../services/api";

const Internet = () => {
  const { t, language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/internet-content");
        const contentMap = {};
        response.data.forEach((item) => {
          contentMap[item.section] = item;
        });
        setContent(contentMap);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getLocalized = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

  const getIcon = (name) => {
    const className = "w-8 h-8 text-accent";
    const icons = {
      Rocket: <Rocket className={className} />,
      Globe: <Globe className={className} />,
      ShieldCheck: <ShieldCheck className={className} />,
      Headphones: <Headphones className={className} />,
      Home: <Home className="w-12 h-12 text-white" />,
      Building2: <Building2 className="w-12 h-12 text-white" />,
      Wifi: <Wifi className={className} />,
      Zap: <Zap className={className} />,
      CheckCircle2: <CheckCircle2 className={className} />,
    };
    return icons[name] || <Rocket className={className} />;
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  const hero = content.hero || {};
  const whyUs = content.why_us || {};
  const services = content.services || {};
  const coverage = content.coverage || {};
  const faq = content.faq || {};
  const cta = content.cta || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${getLocalized(hero.title)} | NAT`}
        description={getLocalized(hero.description)}
        url={window.location.href}
      />
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={
              hero.image
                ? hero.image.startsWith("http")
                  ? hero.image
                  : `${baseUrl}/uploads/${hero.image}`
                : "https://images.unsplash.com/photo-1451187580459-43490279c0fa"
            }
            alt="Internet Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 text-accent">
              <Globe className="w-4 h-4" />
              <span>Internet Service Provider</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight whitespace-pre-line">
              {getLocalized(hero.title)} <br />
              <span className="text-accent">{getLocalized(hero.subtitle)}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
              {getLocalized(hero.description)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={hero.extra_data?.btnHomeLink || "/internet-home"}
                className="bg-accent hover:brightness-90 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-accent/30"
              >
                {getLocalized(hero.extra_data?.btnHome) || "Lihat Paket Rumah"}
              </Link>
              <Link
                to={hero.extra_data?.btnBusinessLink || "/internet-business"}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-8 rounded-full transition-all"
              >
                {getLocalized(hero.extra_data?.btnBusiness) || "Solusi Bisnis"}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {getLocalized(whyUs.title)}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {getLocalized(whyUs.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.items?.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-accent">
                  {getIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {getLocalized(feature.title)}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {getLocalized(feature.description)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Selection */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {getLocalized(services.title)}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {getLocalized(services.subtitle)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {services.items?.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={
                      service.image
                        ? service.image.startsWith("http")
                          ? service.image
                          : `${baseUrl}/uploads/${service.image}`
                        : "https://placehold.co/600x400"
                    }
                    alt={getLocalized(service.title)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 ${service.color || "bg-gradient-to-br from-secondary to-accent"} opacity-90 mix-blend-multiply`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>

                <div className="relative p-8 md:p-12 h-full flex flex-col justify-between min-h-[400px]">
                  <div>
                    <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                      {getIcon(service.icon)}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {getLocalized(service.title)}
                    </h3>
                    <p className="text-white/90 text-lg mb-8 leading-relaxed">
                      {getLocalized(service.description)}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features?.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 text-white/90"
                        >
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                          <span>{getLocalized(feat)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={service.link || "#"}
                    className="inline-flex items-center gap-2 text-white font-bold text-lg group-hover:gap-4 transition-all"
                  >
                    Selengkapnya <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Coverage Check Section */}
      <div className="py-24 bg-gradient-to-r from-secondary to-accent relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {getLocalized(coverage.title)}
          </h2>
          <p className="text-white/90 text-lg mb-8">
            {getLocalized(coverage.subtitle)}
          </p>

          <div className="bg-white p-2 rounded-full shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center px-6 py-3 sm:py-0">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder={getLocalized(coverage.extra_data?.placeholder)}
                className="w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-bold transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" />{" "}
              {getLocalized(coverage.extra_data?.button)}
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getLocalized(faq.title)}
            </h2>
            <p className="text-gray-600">{getLocalized(faq.subtitle)}</p>
          </div>

          <div className="space-y-4">
            {faq.items?.map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openFaqIndex === index
                    ? "bg-accent/5 border-accent/30"
                    : "bg-white border-gray-100 hover:border-accent/20"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-gray-900">
                    {getLocalized(item.question)}
                  </span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-accent" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaqIndex === index
                      ? "max-h-40 pb-6 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {getLocalized(item.answer)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
              {getLocalized(cta.title)}
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              {getLocalized(cta.subtitle)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                to={cta.extra_data?.btnSalesLink || "/contact"}
                className="bg-accent hover:brightness-90 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-accent/30"
              >
                {getLocalized(cta.extra_data?.btnSales)}
              </Link>
              <a
                href={cta.extra_data?.btnChatLink || "https://wa.me/1234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors"
              >
                {getLocalized(cta.extra_data?.btnChat)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Internet;
