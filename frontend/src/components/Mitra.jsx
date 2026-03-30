"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

const PartnerSlider = ({ partners }) => {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemWidth, setItemWidth] = useState(160);

  const duplicatedPartners = [...partners, ...partners, ...partners];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setOffset((prevOffset) => prevOffset - 1);
    }, 25); // Update every 20ms for smooth animation

    return () => clearInterval(interval);
  }, [isPaused, partners.length]);

  useEffect(() => {
    const handleResize = () => {
      // Mobile: w-28 (112px) + gap-4 (16px) = 128px
      // Desktop: w-36 (144px) + gap-8 (32px) = 176px
      setItemWidth(window.innerWidth >= 768 ? 176 : 128);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset offset when it reaches the end
  useEffect(() => {
    if (partners.length > 0 && offset <= -(partners.length * itemWidth)) {
      setOffset(0);
    }
  }, [offset, partners.length, itemWidth]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex items-center gap-4 md:gap-8"
        style={{
          transform: `translateX(${offset}px)`,
          transition: "none",
        }}
      >
        {duplicatedPartners.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="flex-shrink-0 w-28 md:w-36"
          >
            <div className="w-28 h-14 md:w-36 md:h-20 flex items-center justify-center group relative p-2">
              <img
                src={partner.logo_url}
                alt={partner.alt_text || "Partner Logo"}
                width="144"
                height="80"
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
    </div>
  );
};

const Mitra = () => {
  const [partners, setPartners] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await api.get("/partners");
        const formattedData = response.data.map((item) => ({
          name: item.name,
          logo_url: item.logo.startsWith("http")
            ? item.logo
            : `${baseUrl}/uploads/${item.logo}`,
        }));
        setPartners(formattedData);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };

    fetchPartners();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="w-full bg-white py-16 sm:py-24 px-4 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Mitra Kami
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
            Mitra terpercaya yang bekerja sama dengan Palindo Networks
          </p>
        </div> */}

        <div className="space-y-16">
          {/* Business Partners */}
          <div>
            <PartnerSlider partners={partners} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Mitra;
