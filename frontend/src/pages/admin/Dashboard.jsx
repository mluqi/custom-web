import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Briefcase,
  Handshake,
  ArrowRight,
  Loader2,
  TrendingUp,
  Activity,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    jobs: 0,
    partners: 0,
    applicants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Menggunakan Promise.allSettled agar jika satu request gagal, yang lain tetap jalan
        const [usersRes, blogsRes, jobsRes, partnersRes, applicantsRes] =
          await Promise.allSettled([
            api.get("/users"),
            api.get("/blog?limit=1"), // Mengambil meta pagination untuk total
            api.get("/career/admin/list?limit=1"),
            api.get("/partners?show_all=true"),
            api.get("/career/applicants/all?limit=1"),
          ]);

        setStats({
          users:
            usersRes.status === "fulfilled" ? usersRes.value.data.length : 0,
          blogs:
            blogsRes.status === "fulfilled"
              ? blogsRes.value.data.totalItems || 0
              : 0,
          jobs:
            jobsRes.status === "fulfilled"
              ? jobsRes.value.data.totalItems || 0
              : 0,
          partners:
            partnersRes.status === "fulfilled"
              ? partnersRes.value.data.length
              : 0,
          applicants:
            applicantsRes.status === "fulfilled"
              ? applicantsRes.value.data.totalItems || 0
              : 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Pengguna",
      value: stats.users,
      icon: Users,
      color: "bg-blue-500",
      link: "/admin/users",
    },
    {
      title: "Artikel Blog",
      value: stats.blogs,
      icon: FileText,
      color: "bg-green-500",
      link: "/admin/blog",
    },
    {
      title: "Lowongan Kerja",
      value: stats.jobs,
      icon: Briefcase,
      color: "bg-orange-500",
      link: "/admin/jobs",
    },
    {
      title: "Total Pelamar",
      value: stats.applicants,
      icon: TrendingUp,
      color: "bg-purple-500",
      link: "/admin/jobs",
    },
    {
      title: "Mitra",
      value: stats.partners,
      icon: Handshake,
      color: "bg-teal-500",
      link: "/admin/partner",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-lg ${card.color} text-white shadow-md group-hover:scale-110 transition-transform`}
              >
                <card.icon size={24} />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {card.value}
                </h3>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-400 font-medium group-hover:text-teal-600 transition-colors">
              Lihat Detail <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions / Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-teal-600" />
            Status Sistem
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Terakhir Login</span>
              <span className="text-gray-800 text-sm">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Pintasan Cepat
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/blog"
              className="p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all text-center"
            >
              <FileText size={24} className="mx-auto mb-2 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">
                Tulis Artikel
              </span>
            </Link>
            <Link
              to="/admin/jobs/new"
              className="p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all text-center"
            >
              <Briefcase size={24} className="mx-auto mb-2 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">
                Buat Lowongan
              </span>
            </Link>
            <Link
              to="/admin/promo"
              className="p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all text-center"
            >
              <TrendingUp size={24} className="mx-auto mb-2 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">
                Tambah Promo
              </span>
            </Link>
            <Link
              to="/admin/site-setting"
              className="p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all text-center"
            >
              <Settings size={24} className="mx-auto mb-2 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">
                Pengaturan
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
