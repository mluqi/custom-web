import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Rocket,
  ShieldCheck,
  Zap,
  Wifi,
  Heart,
  Users,
} from "lucide-react";
import assets from "../assets/assets";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import api from "../services/api";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { language } = useLanguage();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroFeatures, setHeroFeatures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, settingsRes] = await Promise.all([
          api.get("/content/banners"),
          api.get("/settings/public"),
        ]);

        setBanners(bannersRes.data.filter((b) => b.is_active));

        const settings = settingsRes.data;
        if (settings.hero_features) {
          try {
            const featuresData = JSON.parse(settings.hero_features);
            if (Array.isArray(featuresData)) {
              setHeroFeatures(featuresData);
            }
          } catch (e) {
            console.error("Failed to parse hero_features", e);
          }
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const originalSlides = banners.map((banner) => ({
    desktop: `${baseUrl}/uploads/${banner.desktop_image}`,
    mobile: `${baseUrl}/uploads/${banner.mobile_image}`,
  }));

  // Clone slides for infinite loop
  const slides =
    originalSlides.length > 0
      ? [
          originalSlides[originalSlides.length - 1],
          ...originalSlides,
          originalSlides[0],
        ]
      : [];

  // Peta ikon untuk mencocokkan key dari DB dengan komponen/gambar
  const iconMap = {
    // Dari assets
    fiberIcon: <img src={assets.fiberIcon} alt="Fiber Optik" />,
    fupIcon: <img src={assets.fupIcon} alt="FUP" />,
    modemIcon: <img src={assets.modemIcon} alt="Wi-Fi" />,
    stabilIcon: <img src={assets.stabilIcon} alt="Stabil" />,
    speedometerIcon: <img src={assets.speedometerIcon} alt="Speed" />,
    support247Icon: <img src={assets.support247Icon} alt="Support" />,
    shieldCheckIcon: <img src={assets.shieldCheckIcon} alt="Security" />,
    unlimitedIcon: <img src={assets.unlimitedIcon} alt="Unlimited" />,
    // Dari react-icons
    "lucide-rocket": <Rocket />,
    "lucide-shield-check": <ShieldCheck />,
    "lucide-zap": <Zap />,
    "lucide-wifi": <Wifi />,
    "lucide-heart": <Heart />,
    "lucide-users": <Users />,
  };

  const features = heroFeatures.map((feature) => ({
    iconNode: iconMap[feature.icon] || (
      <img src={assets.fiberIcon} alt="Feature Icon" />
    ),
    title: feature.title?.[language] || feature.title?.id,
    subtitle: feature.subtitle?.[language] || feature.subtitle?.id,
  }));

  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isDragging]);

  const nextSlide = () => {
    if (currentIndex >= slides.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(slides.length - 2);
    } else if (currentIndex === slides.length - 1) {
      setCurrentIndex(1);
    }
  };

  // Swipe handlers
  const getPositionX = (event) => {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartPos(getPositionX(e));
    setIsTransitioning(false);
  };

  const handleDragMove = (e) => {
    if (isDragging) {
      const currentPosition = getPositionX(e);
      setCurrentTranslate(currentPosition - startPos);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const movedBy = currentTranslate;

    if (movedBy < -100) {
      nextSlide();
    } else if (movedBy > 100) {
      prevSlide();
    } else {
      setIsTransitioning(true);
    }
    setCurrentTranslate(0);
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Preload LCP Images untuk mengatasi "Request is discoverable in initial document" */}
      {originalSlides.length > 0 && (
        <>
          <link
            rel="preload"
            as="image"
            href={originalSlides[0].desktop}
            media="(min-width: 768px)"
            fetchPriority="high"
          />
          <link
            rel="preload"
            as="image"
            href={originalSlides[0].mobile}
            media="(max-width: 767px)"
            fetchPriority="high"
          />
        </>
      )}

      {/* Main Slider Container */}
      <div
        className="relative w-full mx-auto aspect-[3/4] md:aspect-[26/9] overflow-hidden bg-gray-100"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={isDragging ? handleDragEnd : undefined}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : (
          <>
            {/* Slides Container */}
            <div
              className="flex h-full"
              style={{
                transform: `translateX(calc(-${
                  currentIndex * 100
                }% + ${currentTranslate}px))`,
                transition: isTransitioning
                  ? "transform 500ms ease-out"
                  : "none",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((slide, index) => (
                <div
                  key={`slide-${index}`}
                  className="w-full h-full flex-shrink-0"
                >
                  <img
                    src={slide.desktop}
                    alt="Banner Desktop"
                    width="1920"
                    height="720"
                    decoding="async"
                    fetchPriority="high"
                    loading="lazy"
                    className="hidden md:block w-full h-full object-cover"
                  />
                  <img
                    src={slide.mobile}
                    alt="Banner Mobile"
                    width="750"
                    height="1000"
                    decoding="async"
                    fetchPriority="high"
                    loading="lazy"
                    className="block md:hidden w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {originalSlides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {originalSlides.length > 1 && (
              <div className="absolute bottom-14 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {originalSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className="p-2 focus:outline-none"
                  >
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        index ===
                        (currentIndex - 1 + originalSlides.length) %
                          originalSlides.length
                          ? "bg-accent w-8"
                          : "bg-gray-300 w-2.5"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Features Bar - Overlapping Slider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 md:-mt-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-secondary to-accent rounded-2xl sm:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 md:gap-3 lg:gap-4 text-white"
              >
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white">
                  {React.cloneElement(feature.iconNode, {
                    className: "w-full h-full object-contain",
                  })}
                </div>
                <div>
                  <div className="text-lg md:text-xl lg:text-2xl font-bold">
                    {feature.title}
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    {feature.subtitle}
                  </div>
                </div>
                {index < features.length - 1 && (
                  <div className="hidden md:block h-8 lg:h-12 w-px bg-white/30 ml-auto" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
