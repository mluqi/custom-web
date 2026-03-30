import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { LogOut, Menu } from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import api from "../services/api";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/public");
        if (response.data.site_logo) {
          setLogoUrl(
            response.data.site_logo.startsWith("http")
              ? response.data.site_logo
              : `${baseUrl}/uploads/${response.data.site_logo}`,
          );
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Mobile Header & Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
            ) : (
              <h1 className="font-bold text-teal-600">NAT CMS</h1>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-600"
          >
            <LogOut size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
