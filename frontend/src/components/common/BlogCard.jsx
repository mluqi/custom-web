import React from "react";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

const BlogCard = ({
  image,
  date,
  readTime,
  title,
  excerpt,
  tags = [],
  slug,
  featured = false,
}) => {
  const { language } = useLanguage();

  // Helper untuk mengambil konten sesuai bahasa
  const getLocalized = (data) => {
    return data?.[language] || data?.["id"] || data?.["en"] || "";
  };

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const displayImage =
    image && (image.startsWith("http") || image.startsWith("/"))
      ? image
      : image
        ? `${baseUrl}/uploads/${image}`
        : "https://placehold.co/600x400?text=No+Image";

  if (featured) {
    return (
      <Link
        to={`/blog/${slug}`}
        className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
      >
        {/* Image */}
        <div className="h-full">
          <img
            src={displayImage}
            alt={getLocalized(title)}
            width="600"
            height="337"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover min-h-[300px]"
          />
        </div>

        {/* Content */}
        <div className="p-8 md:pr-12">
          {/* Meta */}
          <div className="flex items-center gap-3 text-gray-500 text-sm mb-4">
            <span>{date}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-accent transition-colors cursor-pointer">
            {getLocalized(title)}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {getLocalized(excerpt)}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags &&
              tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 border-2 border-gray-200 rounded-full text-sm text-gray-600 hover:border-accent hover:text-accent transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/${slug}`}
      className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer h-full"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={displayImage}
          alt={getLocalized(title)}
          width="400"
          height="224"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 text-gray-500 text-sm mb-3">
          <span>{date}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-accent transition-colors line-clamp-2">
          {getLocalized(title)}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {getLocalized(excerpt)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags &&
            tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 border-2 border-gray-200 rounded-full text-xs text-gray-600 hover:border-accent hover:text-accent transition-colors"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
