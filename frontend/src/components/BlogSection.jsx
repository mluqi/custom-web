import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCard from "./common/BlogCard";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import api from "../services/api";

const BlogSection = () => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/blog/published", {
          params: { limit: 3 },
        });
        const formattedArticles = response.data.articles.map((article) => ({
          ...article,
          date: new Date(article.published_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          readTime: article.read_time,
        }));
        setArticles(formattedArticles);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
    };
    fetchArticles();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("blog.title")}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              {t("blog.subtitle")}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {articles.map((article, index) => (
            <motion.div key={index} variants={itemVariants}>
              <BlogCard {...article} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-accent text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-101 transition-all duration-300"
          >
            {t("blog.viewAll")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
