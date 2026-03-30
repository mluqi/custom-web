import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  Calendar,
  User,
  Tag,
  Loader2,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import api from "../../services/api";
import SEO from "../../components/common/SEO";

const BlogDetail = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch current article
        const articleRes = await api.get(`/blog/${slug}`);
        setArticle(articleRes.data);

        // Fetch recent posts for sidebar
        const recentRes = await api.get("/blog/published", {
          params: { limit: 3 },
        });
        setRecentPosts(
          recentRes.data.articles.filter((a) => a.slug !== slug).slice(0, 3),
        );
      } catch (error) {
        console.error("Failed to fetch blog detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Helper untuk mengambil konten sesuai bahasa
  const getLocalized = (data) => {
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

  // Helper to resolve image URL
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/600x400?text=No+Image";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `${baseUrl}/uploads/${img}`;
  };

  // Share Handlers
  const handleShare = (platform) => {
    const currentUrl = window.location.href;
    const title = getLocalized(article?.title) || "NAT Blog";

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

  if (!article) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 text-gray-500">
        Artikel tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-16">
      <SEO
        title={`${getLocalized(article.title)} | NAT Blog`}
        description={getLocalized(article.excerpt)}
        image={getImageUrl(article.image)}
        url={`${window.location.origin}/blog/${slug}`}
        type="article"
        keywords={
          Array.isArray(article.tags) ? article.tags.join(", ") : article.tags
        }
      />

      <style>{`
        .ql-align-center { text-align: center; }
        .ql-align-right { text-align: right; }
        .ql-align-justify { text-align: justify; }
        .ql-indent-1 { padding-left: 3em; }
        .ql-indent-2 { padding-left: 6em; }
        .ql-indent-3 { padding-left: 9em; }
        .ql-indent-4 { padding-left: 12em; }
        .ql-indent-5 { padding-left: 15em; }
        .ql-indent-6 { padding-left: 18em; }
        .ql-indent-7 { padding-left: 21em; }
        .ql-indent-8 { padding-left: 24em; }
        .ql-size-small { font-size: 0.75em; }
        .ql-size-large { font-size: 1.5em; }
        .ql-size-huge { font-size: 2.5em; }
        .ql-video { width: 100%; height: auto; aspect-ratio: 16/9; }

        /* Custom Content Styling to fix spacing, lists, and quotes */
        .content-body p { margin-bottom: 1.5em; line-height: 1.8; }
        .content-body ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; }
        .content-body ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1.5em; }
        .content-body li { margin-bottom: 0.5em; }
        .content-body blockquote { 
          border-left: 4px solid #14b8a6; 
          padding: 1em; 
          margin: 1.5em 0;
          font-style: italic;
          color: #4b5563;
          background-color: #f9fafb;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .content-body h1, .content-body h2, .content-body h3, .content-body h4 { 
          margin-top: 2em; 
          margin-bottom: 0.75em; 
          font-weight: bold; 
          color: #111827; 
          line-height: 1.3;
        }
        .content-body a { color: #0d9488; text-decoration: underline; }
        .content-body img { margin: 2em 0; border-radius: 0.75rem; width: 100%; height: auto; }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        {/* <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-600 hover:text-teal-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Blog
          </Link>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Featured Image */}
              <div className="w-full h-64 md:h-96 relative">
                <img
                  src={getImageUrl(article.image)}
                  alt={getLocalized(article.title)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-10">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(article.published_at).toLocaleDateString(
                        "id-ID",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.read_time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                  {getLocalized(article.title)}
                </h1>

                {/* Content Body */}
                <div
                  className="content-body prose prose-base md:prose-lg max-w-none w-full text-gray-600 break-words"
                  dangerouslySetInnerHTML={{
                    __html: getLocalized(article.content),
                  }}
                />

                {/* Tags & Share */}
                <div className="border-t border-gray-100 mt-10 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-wrap gap-2">
                      {article.tags &&
                        article.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-medium text-sm">
                        {t("blogDetail.share")}
                      </span>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Share on Facebook"
                      >
                        <FaFacebook size={14} />
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition-colors cursor-pointer"
                        title="Share on Twitter"
                      >
                        <FaTwitter size={14} />
                      </button>
                      <button
                        onClick={() => handleShare("whatsapp")}
                        className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors cursor-pointer"
                        title="Share on WhatsApp"
                      >
                        <FaWhatsapp size={14} />
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Share on LinkedIn"
                      >
                        <FaLinkedin size={14} />
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                        title="Copy Link"
                      >
                        {copied ? <Check size={14} /> : <LinkIcon size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            {/* Recent Posts Widget */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {t("blogDetail.recentArticles")}
              </h3>
              <div className="space-y-6">
                {recentPosts.map((post, idx) => (
                  <Link
                    key={idx}
                    to={`/blog/${post.slug}`}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                      <img
                        src={getImageUrl(post.image)}
                        alt={getLocalized(post.title)}
                        width="80"
                        height="80"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                        {getLocalized(post.title)}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(post.published_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {t("blogDetail.categories")}
              </h3>
              <ul className="space-y-3">
                {[
                  "Technology",
                  "Internet",
                  "Business",
                  "Lifestyle",
                  "Tips & Tricks",
                ].map((cat, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="flex justify-between items-center text-gray-600 hover:text-accent transition-colors group"
                    >
                      <span>{cat}</span>
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                        {Math.floor(Math.random() * 10) + 1}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-gradient-to-br from-secondary to-accent rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">
                {t("blogDetail.newsletter")}
              </h3>
              <p className="text-white/80 text-sm mb-6">
                {t("blogDetail.newsletterDesc")}
              </p>
              <input
                type="email"
                placeholder={t("blogDetail.emailPlaceholder")}
                className="w-full px-4 py-3 rounded-xl text-gray-900 text-sm mb-3 focus:outline-none"
              />
              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                {t("blogDetail.subscribe")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
