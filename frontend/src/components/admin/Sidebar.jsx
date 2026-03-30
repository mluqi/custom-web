import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layout,
  Tag,
  Package,
  Info,
  UserCheck,
  Calendar,
  Trophy,
  Briefcase,
  Layers,
  HandshakeIcon,
  Globe,
  ChevronDown,
  Database,
  Palette,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ isCollapsed, toggleCollapse, isOpen, onClose }) => {
  const { user, menus, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState({
    content: true,
    data: true,
    style: true,
    other: true,
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getIcon = (menuName) => {
    const name = menuName?.toLowerCase() || "";

    if (name.includes("/")) return <LayoutDashboard size={20} />;
    if (name.includes("user") || name.includes("pengguna"))
      return <Users size={20} />;
    if (name.includes("role")) return <Shield size={20} />;
    if (name.includes("content") || name.includes("Banner"))
      return <Layers size={20} />;
    if (name.includes("blog") || name.includes("artikel"))
      return <FileText size={20} />;
    if (name.includes("promo")) return <Tag size={20} />;
    if (
      name.includes("produk") ||
      name.includes("paket") ||
      name.includes("layanan")
    )
      return <Package size={20} />;
    if (name.includes("about") || name.includes("tentang"))
      return <Info size={20} />;
    if (name.includes("team") || name.includes("tim"))
      return <UserCheck size={20} />;
    if (
      name.includes("activity") ||
      name.includes("aktivitas") ||
      name.includes("kegiatan")
    )
      return <Calendar size={20} />;
    if (
      name.includes("achievement") ||
      name.includes("prestasi") ||
      name.includes("sejarah")
    )
      return <Trophy size={20} />;
    if (
      name.includes("career") ||
      name.includes("karir") ||
      name.includes("lowongan")
    )
      return <Briefcase size={20} />;
    if (name.includes("partner") || name.includes("mitra"))
      return <HandshakeIcon size={20} />;
    if (name.includes("setting") || name.includes("pengaturan"))
      return <Settings size={20} />;
    if (name.includes("dynamic") || name.includes("dinamis"))
      return <Layers size={20} />;
    if (name.includes("internet") || name.includes("halaman"))
      return <Globe size={20} />;

    return <LayoutDashboard size={20} />;
  };

  const toggleGroup = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-md flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "md:w-64"}
          transition-all duration-300
        `}
      >
        <div
          className={`p-4 border-b flex items-center ${isCollapsed ? "justify-center" : "justify-between"} h-16`}
        >
          <div
            className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? "justify-center w-full" : ""}`}
          >
            <Layout className="text-teal-600 shrink-0" size={28} />
            {!isCollapsed && (
              <div className="whitespace-nowrap transition-opacity duration-300">
                <h1 className="text-lg font-bold text-gray-800">CMS</h1>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                  Hi, {user?.userName || "Admin"}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          {/* Desktop Collapse Toggle */}
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="hidden md:block text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Collapsed State Toggle Button (When collapsed, show centered at top or bottom, here putting it in header logic above or separate) */}
        {isCollapsed && (
          <div className="hidden md:flex justify-center py-2 border-b border-gray-100">
            <button
              onClick={toggleCollapse}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-3">
          {(() => {
            // Grouping Logic
            const groups = {
              dashboard: [],
              content: [],
              data: [],
              style: [],
              other: [],
            };

            menus?.forEach((menu) => {
              const p = menu.menu_path;
              if (p === "/" || p === "/dashboard") {
                groups.dashboard.push(menu);
              } else if (
                [
                  "/content",
                  "/blog",
                  "/promo",
                  "/activity",
                  "/achievement",
                  "/about-content",
                  "/internet-content",
                  "/dynamic-services",
                  "/entertainment",
                ].some((path) => p.startsWith(path))
              ) {
                groups.content.push(menu);
              } else if (
                [
                  "/users",
                  "/service-packages",
                  "/team-members",
                  "/jobs",
                  "/partner",
                ].some((path) => p.startsWith(path))
              ) {
                groups.data.push(menu);
              } else if (["/site-setting"].some((path) => p.startsWith(path))) {
                groups.style.push(menu);
              } else {
                groups.other.push(menu);
              }
            });

            const renderMenuItem = (menu) => {
              const path = menu.menu_path.startsWith("/admin")
                ? menu.menu_path
                : `/admin${menu.menu_path}`;
              const isActive = location.pathname === path;

              return (
                <Link
                  key={menu.menu_id}
                  to={path}
                  title={isCollapsed ? menu.menu_name : ""}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm mb-1 ${
                    isActive
                      ? "bg-teal-50 text-teal-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${isCollapsed ? "justify-center px-2" : "mx-2"}`}
                >
                  {getIcon(menu.menu_name)}
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{menu.menu_name}</span>
                  )}
                </Link>
              );
            };

            const renderGroup = (key, title, items) => {
              if (!items || items.length === 0) return null;
              if (isCollapsed) {
                return (
                  <>
                    <div className="my-2 border-t border-gray-100 mx-2"></div>
                    {items.map(renderMenuItem)}
                  </>
                );
              }
              return (
                <div className="mb-4">
                  <button
                    onClick={() => toggleGroup(key)}
                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                  >
                    <span>{title}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        expanded[key] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expanded[key]
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {items.map(renderMenuItem)}
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-1">
                {/* Dashboard always on top */}
                {groups.dashboard.map(renderMenuItem)}

                {/* Groups */}
                {renderGroup("content", "Konten", groups.content)}
                {renderGroup("data", "Management Data", groups.data)}
                {renderGroup("style", "Style & Pengaturan", groups.style)}
                {renderGroup("other", "Lainnya", groups.other)}
              </div>
            );
          })()}
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Keluar" : ""}
            className={`flex items-center gap-3 w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
