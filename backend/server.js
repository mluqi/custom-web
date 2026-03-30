require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const bodyparser = require("body-parser");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

//routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleAccessRoutes = require("./routes/roleAccessRoutes");
const contentRoutes = require("./routes/contentRoutes");
const blogRoutes = require("./routes/blogRoutes");
const promoRoutes = require("./routes/promoRoutes");
const servicePackageRoutes = require("./routes/servicePackageRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const activityRoutes = require("./routes/activityRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const jobRoutes = require("./routes/jobRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const sitemapController = require("./controllers/sitemapController");
const siteSettingRoutes = require("./routes/siteSettingRoutes");
const dynamicServiceRoutes = require("./routes/dynamicServiceRoutes");
const internetPageRoutes = require("./routes/internetPageRoutes");
const entertainmentRoutes = require("./routes/entertainmentRoutes");

//logger

const app = express();
const server = http.createServer(app);

// Konfigurasi CORS yang lebih aman dan spesifik
const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

const corsOptions = {
  // Ganti dengan URL frontend Anda saat production
  origin: true,
  credentials: true, // Izinkan pengiriman cookie dan header otorisasi
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/role-access", roleAccessRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/promos", promoRoutes);
app.use("/api/service-packages", servicePackageRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/achievement", achievementRoutes);
app.use("/api/career", jobRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/settings", siteSettingRoutes);
app.use("/api/dynamic-services", dynamicServiceRoutes);
app.use("/api/internet-content", internetPageRoutes);
app.use("/api/entertainment", entertainmentRoutes);

// Sitemap Route (Dynamic)
app.get("/sitemap.xml", sitemapController.getSitemap);

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/documents",
  express.static(path.join(__dirname, "uploads/documents")),
);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
