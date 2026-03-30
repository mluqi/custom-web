import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import assets from "../assets/assets";
import { motion } from "framer-motion";
import tvlogo from "../assets/tvlogo";
import { useLanguage } from "../contexts/LanguageContext";
import api from "../services/api";

const HiburanSection = () => {
  const [showAllChannels, setShowAllChannels] = useState(false);
  const { t, language } = useLanguage();
  const [content, setContent] = useState({
    header: null,
    platforms: [],
    channels: [],
  });
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/entertainment");
        const data = response.data;

        setContent({
          header: data.find((item) => item.category === "header"),
          platforms: data.filter((item) => item.category === "platform"),
          channels: data.filter((item) => item.category === "channel"),
        });
      } catch (error) {
        console.error("Failed to fetch entertainment content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const streamingPlatforms = [
    {
      name: "Vidio",
      logo: assets.vidioIcon,
      color: "red",
      href: "https://www.vidio.com/",
    },
    {
      name: "Vision+",
      logo: assets.visionplusIcon,
      color: "black",
      href: "https://www.visionplus.id/webclient/",
    },
    {
      name: "WeTV",
      logo: assets.wetvIcon,
      color: "blue",
      href: "https://wetv.vip/id",
    },
    {
      name: "Netflix",
      logo: assets.netflixIcon,
      color: "red",
      href: "https://www.netflix.com/",
    },
    {
      name: "Spotify",
      logo: assets.spotifyIcon,
      color: "green",
      href: "https://open.spotify.com/",
    },
  ];

  const tvChannels = [
    { name: "logo1", logo: tvlogo.tvlogo1 },
    { name: "logo2", logo: tvlogo.tvlogo2 },
    { name: "logo3", logo: tvlogo.tvlogo3 },
    { name: "logo4", logo: tvlogo.tvlogo4 },
    { name: "logo5", logo: tvlogo.tvlogo5 },
    { name: "logo6", logo: tvlogo.tvlogo6 },
    { name: "logo7", logo: tvlogo.tvlogo7 },
    { name: "logo8", logo: tvlogo.tvlogo8 },
    { name: "logo9", logo: tvlogo.tvlogo9 },
    { name: "logo10", logo: tvlogo.tvlogo10 },
    { name: "logo11", logo: tvlogo.tvlogo11 },
    { name: "logo12", logo: tvlogo.tvlogo12 },
    { name: "logo13", logo: tvlogo.tvlogo13 },
    { name: "logo14", logo: tvlogo.tvlogo14 },
    { name: "logo15", logo: tvlogo.tvlogo15 },
    { name: "logo16", logo: tvlogo.tvlogo16 },
    { name: "logo17", logo: tvlogo.tvlogo17 },
    { name: "logo18", logo: tvlogo.tvlogo18 },
    { name: "logo19", logo: tvlogo.tvlogo19 },
    { name: "logo20", logo: tvlogo.tvlogo20 },
    { name: "logo21", logo: tvlogo.tvlogo21 },
    { name: "logo22", logo: tvlogo.tvlogo22 },
    { name: "logo23", logo: tvlogo.tvlogo23 },
    { name: "logo24", logo: tvlogo.tvlogo24 },
    { name: "logo25", logo: tvlogo.tvlogo25 },
    { name: "logo26", logo: tvlogo.tvlogo26 },
    { name: "logo27", logo: tvlogo.tvlogo27 },
    { name: "logo28", logo: tvlogo.tvlogo28 },
    { name: "logo29", logo: tvlogo.tvlogo29 },
    { name: "logo30", logo: tvlogo.tvlogo30 },
    { name: "logo31", logo: tvlogo.tvlogo31 },
    { name: "logo32", logo: tvlogo.tvlogo32 },
  ];

  // Helper untuk lokalisasi
  const getLocalized = (data) => {
    if (!data) return "";
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      return parsed?.[language] || parsed?.["id"] || parsed?.["en"] || "";
    } catch (e) {
      return data || "";
    }
  };

  // Helper untuk meta data
  const getMeta = (item, key) => {
    if (!item || !item.meta) return null;
    try {
      const meta =
        typeof item.meta === "string" ? JSON.parse(item.meta) : item.meta;
      return meta[key];
    } catch {
      return null;
    }
  };

  // Helper untuk URL gambar
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/200x100?text=No+Logo";
    if (img.startsWith("http")) return img;

    // Fallback ke assets lokal jika nama file cocok (untuk transisi dari statis ke dinamis)
    if (img.includes("vidio")) return assets.vidioIcon;
    if (img.includes("vision")) return assets.visionplusIcon;
    if (img.includes("wetv")) return assets.wetvIcon;
    if (img.includes("netflix")) return assets.netflixIcon;
    if (img.includes("spotify")) return assets.spotifyIcon;
    if (img.includes("hiburan-device")) return assets.hiburanImage;

    // Fallback untuk TV Logo dari seeder
    const tvMatch = img.match(/tv-logo-(\d+)\.png/);
    if (tvMatch && tvlogo[`tvlogo${tvMatch[1]}`]) {
      return tvlogo[`tvlogo${tvMatch[1]}`];
    }

    return `${baseUrl}/uploads/${img}`;
  };

  // Data Processing (Prioritize API data, fallback to static)
  const headerData = content.header;

  const platformsData =
    content.platforms.length > 0
      ? content.platforms
      : streamingPlatforms.map((p) => ({
          ...p,
          title: p.name,
          image: p.logo,
          url: p.href,
          meta: JSON.stringify({ color: p.color }),
        }));

  const channelsData =
    content.channels.length > 0
      ? content.channels
      : tvChannels.map((c) => ({ ...c, title: c.name, image: c.logo }));

  const displayedChannels = showAllChannels
    ? channelsData
    : channelsData.slice(0, 18);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/50 via-secondary/50 to-accent/70 opacity-60"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <p className="text-white text-lg font-semibold mb-2">
                {headerData
                  ? getLocalized(getMeta(headerData, "header_text"))
                  : t("hiburan.header")}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {headerData
                  ? getLocalized(headerData.title)
                  : t("hiburan.title")}
              </h2>
              <p className="text-white text-lg opacity-90">
                {headerData
                  ? getLocalized(headerData.subtitle)
                  : t("hiburan.subtitle")}
              </p>
            </div>

            {/* Description */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-gray-900 font-semibold text-lg">
                {headerData
                  ? getLocalized(headerData.description)
                  : t("hiburan.description")}
              </p>
            </div>

            {/* Streaming Platforms */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {platformsData.slice(0, 4).map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url || platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-gray-50 rounded-2xl p-6 flex items-center justify-between shadow-lg transition-all hover:scale-101 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          platform.image && typeof platform.image === "string"
                            ? getImageUrl(platform.image)
                            : platform.logo
                        }
                        alt={getLocalized(platform.title) || platform.name}
                        width="96"
                        height="32"
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 768px) 40vw, 20vw"
                        className="h-8 object-contain"
                      />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>

              {/* Spotify Full Width */}
              {platformsData[4] && (
                <a
                  href={platformsData[4].url || platformsData[4].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white hover:bg-gray-50 rounded-2xl p-6 flex items-center justify-between shadow-lg transition-all hover:scale-101 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        platformsData[4].image &&
                        typeof platformsData[4].image === "string"
                          ? getImageUrl(platformsData[4].image)
                          : platformsData[4].logo
                      }
                      alt={
                        getLocalized(platformsData[4].title) ||
                        platformsData[4].name
                      }
                      width="96"
                      height="32"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 40vw, 20vw"
                      className="h-8 object-contain"
                    />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </a>
              )}
            </div>

            {/* TV Channels Grid */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mb-6">
                {displayedChannels.map((channel, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={
                        channel.image && typeof channel.image === "string"
                          ? getImageUrl(channel.image)
                          : channel.logo
                      }
                      alt={getLocalized(channel.title) || channel.name}
                      width="64"
                      height="32"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 25vw, 15vw"
                      className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setShowAllChannels(!showAllChannels)}
                className="w-full bg-accent hover:brightness-90 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-colors group"
              >
                {showAllChannels
                  ? t("hiburan.viewLess")
                  : t("hiburan.viewMore")}
                <ArrowRight
                  className={`w-5 h-5 transition-transform ${
                    showAllChannels ? "-rotate-90" : "group-hover:translate-x-1"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Right Content - Device img */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={
                  headerData?.image
                    ? getImageUrl(headerData.image)
                    : assets.hiburanImage
                }
                alt="Entertainment Device"
                width="600"
                height="450"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 -right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -left-10 w-48 h-48 bg-accent/30 rounded-full blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HiburanSection;
