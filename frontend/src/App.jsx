import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

//login admin pages
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import UserManagement from "./pages/admin/userManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import PromoManagement from "./pages/admin/PromoManagement";
import ServicePackageManagement from "./pages/admin/ServicePackageManagement";
import AboutContentManagement from "./pages/admin/AboutContentManagement";
import TeamManagement from "./pages/admin/TeamManagement";
import ActivityManagement from "./pages/admin/ActivityManagement";
import AchievementManagement from "./pages/admin/AchievementManagement";
import JobManagement from "./pages/admin/JobManagement";
import JobDetailManagement from "./pages/admin/JobDetailManagement";
import PartnerManagement from "./pages/admin/PartnerManagement";
import SiteSetting from "./pages/admin/SiteSetting";
import DynamicServiceManagement from "./pages/admin/DynamicServiceManagement";
import InternetContentManagement from "./pages/admin/InternetContentManagement";
import Entertainment from "./pages/admin/Entertainment";

//pages
import Home from "./pages/public/Home";
import Blog from "./pages/public/Blog";
import BlogDetail from "./pages/public/BlogDetail";
import Contact from "./pages/public/Contact";
import Promo from "./pages/public/Promo";
import Internet from "./pages/public/Internet";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import NotFound from "./pages/public/NotFound";
import Maintenance from "./pages/public/Maintenance";
import JobApplicant from "./pages/public/JobApplicant";
import DynamicServicePage from "./pages/public/DynamicServicePage";

//aboutpages
import Career from "./pages/public/About/Career";
import CareerDetail from "./pages/public/About/CareerDetail";
import About from "./pages/public/About/About";
import Activity from "./pages/public/About/Activity";
import ActivityDetail from "./pages/public/About/ActivityDetail";
import Achievement from "./pages/public/About/Achievement";
import TeamList from "./pages/public/About/TeamList";

//pages produk
// import InternetBusiness from "./pages/public/Layanan/InternetBusiness";
import InternetHome from "./pages/public/Layanan/InternetHome";

//components
import AboutLayout from "./layouts/AboutLayout";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ScrollToTop from "./components/common/ScrollToTop";

import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import RequireAuth from "./components/auth/RequireAuth";
import { useTheme } from "./hooks/useTheme";

function App() {
  useTheme(); // Load warna dari database saat aplikasi mulai

  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Main Public Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="promo" element={<Promo />} />
            <Route path="internet" element={<Internet />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />

            {/* Produk Routes */}
            {/* <Route path="internet-business" element={<InternetBusiness />} /> */}
            <Route path="internet-home" element={<InternetHome />} />
            {/* Dynamic Service Route */}
            <Route path="services/:slug" element={<DynamicServicePage />} />
          </Route>

          {/* About Us Layout */}
          <Route element={<AboutLayout />}>
            <Route path="about-us" element={<About />} />
            <Route path="career" element={<Career />} />
            <Route path="career/apply" element={<JobApplicant />} />
            <Route path="career/:slug" element={<CareerDetail />} />
            <Route path="activity" element={<Activity />} />
            <Route path="activity/:id" element={<ActivityDetail />} />
            <Route path="achievement" element={<Achievement />} />
            <Route path="about/team" element={<TeamList />} />
          </Route>

          {/* Standalone Public Routes */}
          <Route
            path="login"
            element={
              <AuthProvider>
                <Login />
              </AuthProvider>
            }
          />
          <Route path="maintenance" element={<Maintenance />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AuthProvider>
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              </AuthProvider>
            }
          >
            {/* Default route for /admin */}
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="promo" element={<PromoManagement />} />
            <Route
              path="service-packages"
              element={<ServicePackageManagement />}
            />
            <Route path="about-content" element={<AboutContentManagement />} />
            <Route path="team-members" element={<TeamManagement />} />
            <Route path="activity" element={<ActivityManagement />} />
            <Route path="achievement" element={<AchievementManagement />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="jobs/:id" element={<JobDetailManagement />} />
            <Route path="partner" element={<PartnerManagement />} />
            <Route path="site-setting" element={<SiteSetting />} />
            <Route
              path="dynamic-services"
              element={<DynamicServiceManagement />}
            />
            <Route
              path="internet-content"
              element={<InternetContentManagement />}
            />
            <Route path="entertainment" element={<Entertainment />} />
            {/* Tambahkan route admin lainnya di sini sesuai menu_path */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
