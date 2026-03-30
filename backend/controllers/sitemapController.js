const { Article, Job, Activity } = require("../models");

exports.getSitemap = async (req, res) => {
  try {
    // URL Frontend Anda (Sesuaikan jika berbeda di production)
    let frontendUrl = process.env.FRONTEND_URL || "https://naomiaurora.com";
    if (frontendUrl.endsWith("/")) {
      frontendUrl = frontendUrl.slice(0, -1);
    }

    // 1. Daftar Halaman Statis (Prioritas tinggi)
    const staticRoutes = [
      { url: "", changefreq: "daily", priority: 1.0 },
      { url: "/internet", changefreq: "weekly", priority: 0.9 },
      { url: "/layanan", changefreq: "weekly", priority: 0.9 },
      { url: "/promo", changefreq: "weekly", priority: 0.9 },
      { url: "/blog", changefreq: "daily", priority: 0.8 },
      { url: "/about-us", changefreq: "monthly", priority: 0.7 },
      { url: "/contact", changefreq: "monthly", priority: 0.7 },
      { url: "/career", changefreq: "weekly", priority: 0.7 },
      { url: "/internet-home", changefreq: "weekly", priority: 0.8 },
      { url: "/internet-business", changefreq: "weekly", priority: 0.8 },
      { url: "/wifi-hotspot", changefreq: "monthly", priority: 0.8 },
      { url: "/iptv", changefreq: "monthly", priority: 0.8 },
      { url: "/cctv", changefreq: "monthly", priority: 0.8 },
      { url: "/sistem-billing", changefreq: "monthly", priority: 0.8 },
      { url: "/it-solution", changefreq: "monthly", priority: 0.8 },
      { url: "/tefa", changefreq: "monthly", priority: 0.7 },
      { url: "/activity", changefreq: "weekly", priority: 0.6 },
      { url: "/achievement", changefreq: "monthly", priority: 0.6 },
      { url: "/privacy-policy", changefreq: "yearly", priority: 0.5 },
    ];

    // 2. Ambil data dinamis dari Database
    const articles = await Article.findAll({
      where: { is_published: true },
      attributes: ["slug", "updatedAt"],
      order: [["updatedAt", "DESC"]],
    });

    const jobs = await Job.findAll({
      where: { is_active: true },
      attributes: ["slug", "updatedAt"],
      order: [["updatedAt", "DESC"]],
    });

    const activities = await Activity.findAll({
      attributes: ["id", "updatedAt"],
      order: [["updatedAt", "DESC"]],
    });

    // 3. Buat XML String
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  ${staticRoutes
    .map((route) => {
      return `
  <url>
    <loc>${frontendUrl}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("")}

  <!-- Dynamic Blog Posts -->
  ${articles
    .map((article) => {
      return `
  <url>
    <loc>${frontendUrl}/blog/${article.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>
  </url>`;
    })
    .join("")}

  <!-- Dynamic Career Posts -->
  ${jobs
    .map((job) => {
      return `
  <url>
    <loc>${frontendUrl}/career/${job.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <lastmod>${new Date(job.updatedAt).toISOString()}</lastmod>
  </url>`;
    })
    .join("")}

  <!-- Dynamic Activity Posts -->
  ${activities
    .map((activity) => {
      return `
  <url>
    <loc>${frontendUrl}/activity/${activity.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
    <lastmod>${new Date(activity.updatedAt).toISOString()}</lastmod>
  </url>`;
    })
    .join("")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
};
