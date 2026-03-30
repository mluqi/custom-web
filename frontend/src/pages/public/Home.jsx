import React from "react";
import HeroSection from "../../components/Hero";
import Palindo from "../../components/Palindo";
import Layanan from "../../components/Layanan";
import HiburanSection from "../../components/Hiburan";
import MitraSection from "../../components/Mitra";
import BlogSection from "../../components/BlogSection";
import SEO from "../../components/common/SEO";

const Home = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Nat Waipi - Masa Depan Koneksi Anda"
        description="Nat Waipi - Masa Depan Koneksi Anda"
        url={window.location.href}
      />
      <HeroSection />
      <Palindo />
      <Layanan />
      <HiburanSection />
      <MitraSection />
      <BlogSection />
    </div>
  );
};

export default Home;
