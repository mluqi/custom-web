import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Loader2,
  Briefcase,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import api from "../../services/api";
import Table from "../../components/common/Table";

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Table States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Fetch Jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        status: filterStatus,
      };
      const response = await api.get("/career/admin/list", { params });
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 500); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [currentPage, searchQuery, filterStatus]);

  const handleDelete = async () => {
    if (!currentJob) return;
    setActionLoading(true);
    try {
      await api.delete(`/career/${currentJob.id}`);
      await fetchJobs();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Gagal menghapus lowongan pekerjaan.");
    } finally {
      setActionLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + jobs.length;

  const columns = [
    {
      header: "Posisi",
      accessor: "title",
      render: (job) => (
        <div>
          <div className="font-bold text-gray-900">{job.title}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Clock size={12} /> {job.type}
          </div>
        </div>
      ),
    },
    {
      header: "Departemen",
      accessor: "department",
      render: (job) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {job.department}
        </span>
      ),
    },
    {
      header: "Lokasi",
      accessor: "location",
      render: (job) => (
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin size={14} className="text-teal-500" />
          {job.location}
        </div>
      ),
    },
    {
      header: "Pelamar",
      accessor: "applicantCount",
      render: (job) => (
        <div className="flex items-center gap-1 text-gray-600 font-medium">
          <Users size={14} className="text-teal-500" />
          {job.applicantCount || 0}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "is_active",
      render: (job) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            job.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {job.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
          {job.is_active ? "Aktif" : "Non-Aktif"}
        </span>
      ),
    },
    {
      header: "Aksi",
      className: "text-right",
      render: (job) => (
        <div className="flex justify-end gap-2">
          <Link
            to={`/admin/jobs/${job.id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Kelola Lowongan"
          >
            <Eye size={16} />
          </Link>
          <button
            onClick={() => {
              setCurrentJob(job);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Karir</h1>
          <p className="text-gray-500">
            Kelola lowongan pekerjaan yang tersedia
          </p>
        </div>
        <Link
          to="/admin/jobs/new"
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tambah Lowongan
        </Link>
      </div>

      <Table
        columns={columns}
        data={jobs}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1); // Reset ke halaman 1 saat search berubah
        }}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          startIndex,
          endIndex,
          onPageChange: setCurrentPage,
        }}
        filters={
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Non-Aktif</option>
          </select>
        }
        emptyMessage="Belum ada lowongan pekerjaan yang sesuai."
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Hapus Lowongan?
              </h3>
              <p className="text-gray-600 mb-6">
                Tindakan ini akan menghapus lowongan{" "}
                <strong>{currentJob?.title}</strong> secara permanen.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
                >
                  {actionLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
