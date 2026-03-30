import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  ArrowLeft,
  CheckCircle,
  Share2,
  Loader2,
} from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import api from "../../../services/api";

const CareerDetail = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/career/${slug}`);
        setJob(response.data);
      } catch (error) {
        console.error("Failed to fetch job detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [slug]);

  const handleShare = (platform) => {
    const currentUrl = window.location.href;
    const title = job?.title
      ? `Lowongan Kerja: ${job.title} di NAT`
      : "Karir di NAT";

    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + currentUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 text-gray-500">
        Lowongan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        {/* <Link
          to="/career"
          className="inline-flex items-center text-gray-600 hover:text-[#569580] mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Karir
        </Link> */}

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>{job.type}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link
                to={`/career/apply?position=${encodeURIComponent(job.title)}&jobId=${job.id}`}
                className="flex-1 md:flex-none bg-accent hover:brightness-90 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg shadow-accent/30 inline-flex items-center justify-center"
              >
                Lamar Sekarang
              </Link>
              <button
                onClick={handleCopyLink}
                className="p-3 border-2 border-gray-200 rounded-full hover:border-accent hover:text-accent transition-colors text-gray-400"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-accent" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Deskripsi Pekerjaan
              </h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Tanggung Jawab
              </h2>
              <ul className="space-y-3">
                {job.responsibilities &&
                  job.responsibilities.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Persyaratan
              </h2>
              <ul className="space-y-3">
                {job.requirements &&
                  job.requirements.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-secondary to-accent rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Tertarik bergabung?</h3>
              <p className="mb-6 opacity-90">
                Jangan lewatkan kesempatan untuk berkarir bersama kami. Kirimkan
                CV terbaik Anda sekarang.
              </p>
              <Link
                to={`/career/apply?position=${encodeURIComponent(job.title)}&jobId=${job.id}`}
                className="block w-full bg-white text-accent font-bold py-3 rounded-full hover:bg-gray-50 transition-colors text-center"
              >
                Lamar Posisi Ini
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Bagikan Lowongan</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare("facebook")}
                  className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <FaFacebook size={18} />
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center cursor-pointer hover:bg-sky-100 transition-colors"
                >
                  <FaTwitter size={18} />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <FaLinkedin size={18} />
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center cursor-pointer hover:bg-green-100 transition-colors"
                >
                  <FaWhatsapp size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDetail;
