import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Plus,
  Trash2,
  X,
  Save,
  Loader2,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  GraduationCap,
  Award,
  ExternalLink,
  FileText,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import api from "../../services/api";
import Table from "../../components/common/Table";

const JobDetailManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isNew = id === "new";

  // Job States
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(!isNew);
  const [isEditModalOpen, setIsEditModalOpen] = useState(isNew);

  // Applicant States
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(!isNew);

  // URL Params State
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";
  const filterStatus = searchParams.get("status") || "all";
  const [localSearch, setLocalSearch] = useState(searchQuery); // State lokal untuk input search agar responsif

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Applicant Modal States
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("all");
  const [exporting, setExporting] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const initialFormState = {
    title: "",
    location: "",
    department: "",
    type: "Full-time",
    description: "",
    requirements: [""],
    responsibilities: [""],
    is_active: true,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [actionLoading, setActionLoading] = useState(false);

  // --- DATA FETCHING ---
  const fetchJobDetails = async () => {
    if (isNew) return;
    setJobLoading(true);
    try {
      const response = await api.get(`/career/admin/list/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      setJob(null);
    } finally {
      setJobLoading(false);
    }
  };

  const fetchApplicants = async () => {
    if (isNew) return;
    setApplicantsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        status: filterStatus,
        job_id: id,
      };
      const response = await api.get("/career/applicants/all", { params });
      setApplicants(response.data.applicants);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
    } finally {
      setApplicantsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  // Sync local search dengan URL (jika navigasi back/forward)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce update URL saat mengetik search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (localSearch) newParams.set("search", localSearch);
          else newParams.delete("search");
          newParams.set("page", "1"); // Reset ke halaman 1 saat search berubah
          return newParams;
        });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [localSearch, setSearchParams, searchQuery]);

  useEffect(() => {
    if (!isNew) fetchApplicants();
  }, [id, currentPage, searchQuery, filterStatus]);

  // --- JOB FORM HANDLERS ---
  const openEditModal = () => {
    if (!job && !isNew) return;
    setFormData(
      isNew
        ? initialFormState
        : {
            title: job.title || "",
            location: job.location || "",
            department: job.department || "",
            type: job.type || "Full-time",
            description: job.description || "",
            requirements: Array.isArray(job.requirements)
              ? job.requirements
              : JSON.parse(job.requirements || "[]"),
            responsibilities: Array.isArray(job.responsibilities)
              ? job.responsibilities
              : JSON.parse(job.responsibilities || "[]"),
            is_active: job.is_active,
          },
    );
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleListChange = (index, value, field) => {
    const newList = [...formData[field]];
    newList[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newList }));
  };

  const addListItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListItem = (index, field) => {
    const newList = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newList }));
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const cleanData = {
      ...formData,
      requirements: formData.requirements.filter((item) => item.trim() !== ""),
      responsibilities: formData.responsibilities.filter(
        (item) => item.trim() !== "",
      ),
    };

    try {
      if (isNew) {
        const response = await api.post("/career", cleanData);
        navigate(`/admin/jobs/${response.data.id}`);
      } else {
        await api.put(`/career/${id}`, cleanData);
        await fetchJobDetails();
      }
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Gagal menyimpan lowongan pekerjaan.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- APPLICANT HANDLERS (Copied from JobApplicantsManagement) ---
  const RECRUITMENT_STAGES = {
    pending: "Pending",
    seleksi_administrasi: "Seleksi Administrasi",
    tes_psikotes: "Tes Psikotes",
    interview_hr: "Interview HR",
    tes_kompetensi: "Tes Kompetensi",
    interview_user: "Interview User",
    offering: "Offering",
    hired: "Diterima (Hired)",
    rejected: "Ditolak",
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplicant || !newStatus) return;
    setStatusLoading(true);
    try {
      await api.put(`/career/applicants/${selectedApplicant.id}/status`, {
        status: newStatus,
      });
      setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      fetchApplicants(); // Refresh list
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Gagal memperbarui status pelamar.");
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      seleksi_administrasi: "bg-gray-100 text-gray-800",
      tes_psikotes: "bg-purple-100 text-purple-800",
      interview_hr: "bg-blue-100 text-blue-800",
      tes_kompetensi: "bg-yellow-100 text-yellow-800",
      interview_user: "bg-orange-100 text-orange-800",
      offering: "bg-teal-100 text-teal-800",
      hired: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {RECRUITMENT_STAGES[status] || status}
      </span>
    );
  };

  const getPelatihanList = (applicant) => {
    const names = applicant.pelatihan_name || [];
    const orgs = applicant.pelatihan_orgaisasi || [];
    const dates = applicant.pelatihan_date || [];
    if (!Array.isArray(names)) return [];
    return names.map((name, index) => ({
      name,
      org: orgs[index] || "-",
      date: dates[index] || "-",
    }));
  };

  const handleDownloadCVs = async () => {
    if (!applicants.length) return;
    setDownloading(true);
    try {
      const response = await api.get(`/career/admin/jobs/${id}/download-cvs`, {
        responseType: "blob",
      });

      const date = new Date().toISOString().split("T")[0];
      const safeTitle = job?.title.replace(/[^a-z0-9]/gi, "_") || "Job";
      const fileName = `CV_${safeTitle}_${date}.zip`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Failed to download CVs:", error);
      alert("Gagal mengunduh CV. Silakan coba lagi.");
    } finally {
      setDownloading(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const response = await api.get(`/career/admin/jobs/${id}/export-excel`, {
        params: { status: exportStatus },
        responseType: "blob",
      });

      const date = new Date().toISOString().split("T")[0];
      const safeTitle = job?.title.replace(/[^a-z0-9]/gi, "_") || "Job";
      const fileName = `Applicants_${safeTitle}_${date}.xlsx`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Failed to export excel:", error);
      alert("Gagal mengexport data. Silakan coba lagi.");
    } finally {
      setExporting(false);
    }
  };

  const applicantColumns = [
    {
      header: "Nama Pelamar",
      accessor: "name",
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Tanggal Melamar",
      accessor: "createdAt",
      render: (row) => (
        <div className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: "Aksi",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setSelectedApplicant(row);
              setNewStatus(row.status);
              setIsApplicantModalOpen(true);
            }}
            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium cursor-pointer"
          >
            <Eye size={16} /> Detail
          </button>
        </div>
      ),
    },
  ];

  // --- RENDER ---
  if (jobLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!job && !isNew) {
    return (
      <div className="p-6 text-center text-gray-500">
        Lowongan pekerjaan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link
            to="/admin/jobs"
            className="inline-flex items-center text-gray-500 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke Daftar Lowongan
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            {isNew ? "Buat Lowongan Baru" : job.title}
          </h1>
          {!isNew && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 mt-2">
              <span className="flex items-center gap-2">
                <Briefcase size={14} /> {job.department}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> {job.location}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} /> {job.type}
              </span>
            </div>
          )}
        </div>
        {!isNew && (
          <button
            onClick={openEditModal}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Edit size={16} />
            Edit Lowongan
          </button>
        )}
      </div>

      {/* Job Details & Applicants Table */}
      {!isNew && (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Detail Lowongan
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Deskripsi</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Tanggung Jawab
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-600">
                    {(Array.isArray(job.responsibilities)
                      ? job.responsibilities
                      : JSON.parse(job.responsibilities || "[]")
                    ).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Persyaratan
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-600">
                    {(Array.isArray(job.requirements)
                      ? job.requirements
                      : JSON.parse(job.requirements || "[]")
                    ).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Daftar Pelamar ({totalItems})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  disabled={applicants.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
                >
                  <FileSpreadsheet size={16} />
                  Export Excel
                </button>
                <button
                  onClick={handleDownloadCVs}
                  disabled={downloading || applicants.length === 0}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
                >
                  {downloading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  Download Semua CV
                </button>
              </div>
            </div>
            <Table
              columns={applicantColumns}
              data={applicants}
              isLoading={applicantsLoading}
              searchQuery={localSearch}
              onSearchChange={(val) => {
                setLocalSearch(val);
              }}
              pagination={{
                currentPage,
                totalPages,
                totalItems,
                startIndex: (currentPage - 1) * itemsPerPage,
                endIndex: (currentPage - 1) * itemsPerPage + applicants.length,
                onPageChange: (page) => {
                  setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set("page", page.toString());
                    return newParams;
                  });
                },
              }}
              filters={
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.set("status", e.target.value);
                      newParams.set("page", "1");
                      return newParams;
                    })
                  }
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 bg-white cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  {Object.entries(RECRUITMENT_STAGES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              }
              emptyMessage="Belum ada pelamar untuk lowongan ini."
            />
          </div>
        </>
      )}

      {/* Job Edit/Create Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {isNew ? "Tambah Lowongan Baru" : "Edit Lowongan"}
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  if (isNew) navigate("/admin/jobs");
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleJobSubmit}
              className="p-6 space-y-6 overflow-y-auto"
            >
              {/* Form content is identical to the one in the old JobManagement, so it's omitted for brevity but should be pasted here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Posisi
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departemen
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g. Engineering, Marketing"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipe Pekerjaan
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Persyaratan
                    </label>
                    <button
                      type="button"
                      onClick={() => addListItem("requirements")}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                    >
                      <Plus size={14} /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) =>
                            handleListChange(
                              index,
                              e.target.value,
                              "requirements",
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                          placeholder="Poin persyaratan..."
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem(index, "requirements")}
                          className="text-gray-400 hover:text-red-500 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tanggung Jawab
                    </label>
                    <button
                      type="button"
                      onClick={() => addListItem("responsibilities")}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                    >
                      <Plus size={14} /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.responsibilities.map((res, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={res}
                          onChange={(e) =>
                            handleListChange(
                              index,
                              e.target.value,
                              "responsibilities",
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                          placeholder="Poin tanggung jawab..."
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeListItem(index, "responsibilities")
                          }
                          className="text-gray-400 hover:text-red-500 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm text-gray-700 cursor-pointer select-none"
                >
                  Aktifkan Lowongan Ini (Tampilkan di Website)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    if (isNew) navigate("/admin/jobs");
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
                >
                  {actionLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicant Detail Modal (Copied from JobApplicantsManagement) */}
      {isApplicantModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          {/* Modal content is identical to the one in the old JobApplicantsManagement, so it's omitted for brevity but should be pasted here */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Detail Pelamar
                </h3>
                <p className="text-sm text-gray-500">
                  ID: #{selectedApplicant.id} • Melamar pada{" "}
                  {new Date(selectedApplicant.createdAt).toLocaleDateString(
                    "id-ID",
                  )}
                </p>
              </div>
              <button
                onClick={() => setIsApplicantModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile & Status */}
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-2xl font-bold">
                        {selectedApplicant.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          {selectedApplicant.name}
                        </h4>
                        <p className="text-sm text-gray-500">{job?.title}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Mail size={16} />
                        <a
                          href={`mailto:${selectedApplicant.email}`}
                          className="hover:text-teal-600"
                        >
                          {selectedApplicant.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone size={16} />
                        <a
                          href={`https://wa.me/${selectedApplicant.phone.replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-teal-600"
                        >
                          {selectedApplicant.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-3 text-gray-600">
                        <MapPin size={16} className="shrink-0 mt-0.5" />
                        <span>{selectedApplicant.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <User size={16} />
                        <span>
                          {selectedApplicant.age} Tahun •{" "}
                          {selectedApplicant.current_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-4">
                      Update Status
                    </h5>
                    <div className="space-y-3">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 bg-white"
                      >
                        {Object.entries(RECRUITMENT_STAGES).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                      <button
                        onClick={handleStatusUpdate}
                        disabled={
                          statusLoading ||
                          newStatus === selectedApplicant.status
                        }
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        {statusLoading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-4">Dokumen</h5>
                    <div className="space-y-3">
                      {selectedApplicant.cv_file && (
                        <a
                          href={`${baseUrl}/uploads/documents/${selectedApplicant.cv_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="text-teal-600" size={20} />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700">
                              Curriculum Vitae
                            </span>
                          </div>
                          <ExternalLink
                            size={16}
                            className="text-gray-400 group-hover:text-teal-600"
                          />
                        </a>
                      )}
                      {selectedApplicant.portfolio_file && (
                        <a
                          href={`${baseUrl}/uploads/documents/${selectedApplicant.portfolio_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <Briefcase className="text-teal-600" size={20} />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700">
                              Portofolio
                            </span>
                          </div>
                          <ExternalLink
                            size={16}
                            className="text-gray-400 group-hover:text-teal-600"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Education */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap size={20} className="text-teal-500" />
                      Pendidikan
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Institusi
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedApplicant.school}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Jurusan
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedApplicant.major}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Jenjang
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedApplicant.education}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Nilai Akhir / IPK
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedApplicant.nilai_akhir_ipk || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Experience & Socials */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase size={20} className="text-teal-500" />
                      Pengalaman & Lainnya
                    </h5>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Pengalaman Relevan
                          </p>
                          <p className="font-medium text-gray-900">
                            {selectedApplicant.has_experience ? "Ya" : "Tidak"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Posisi Pengalaman
                          </p>
                          <p className="font-medium text-gray-900">
                            {selectedApplicant.experience_position || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Bersedia Ditempatkan
                          </p>
                          <p className="font-medium text-gray-900">
                            {selectedApplicant.willing_to_relocate
                              ? "Ya"
                              : "Tidak"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                          Media Sosial
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {selectedApplicant.linkedin_link && (
                            <a
                              href={selectedApplicant.linkedin_link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                            >
                              LinkedIn
                            </a>
                          )}
                          {selectedApplicant.instagram_link && (
                            <a
                              href={selectedApplicant.instagram_link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm hover:bg-pink-100 transition-colors"
                            >
                              Instagram
                            </a>
                          )}
                          {selectedApplicant.tiktok_link && (
                            <a
                              href={selectedApplicant.tiktok_link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors"
                            >
                              TikTok
                            </a>
                          )}
                          {!selectedApplicant.linkedin_link &&
                            !selectedApplicant.instagram_link &&
                            !selectedApplicant.tiktok_link && (
                              <span className="text-sm text-gray-400 italic">
                                Tidak ada media sosial
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Training / Certifications */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award size={20} className="text-teal-500" />
                      Pelatihan & Sertifikasi
                    </h5>

                    {getPelatihanList(selectedApplicant).length > 0 ? (
                      <div className="space-y-4">
                        {getPelatihanList(selectedApplicant).map(
                          (item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                                <Award size={20} />
                              </div>
                              <div>
                                <h6 className="font-bold text-gray-900">
                                  {item.name}
                                </h6>
                                <p className="text-sm text-gray-600">
                                  {item.org}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {item.date
                                    ? new Date(item.date).toLocaleDateString(
                                        "id-ID",
                                      )
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Tidak ada data pelatihan.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Excel Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Export Data Pelamar
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Status Tahapan
                </label>
                <select
                  value={exportStatus}
                  onChange={(e) => setExportStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 bg-white"
                >
                  <option value="all">Semua Status</option>
                  {Object.entries(RECRUITMENT_STAGES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleExportExcel}
                disabled={exporting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {exporting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileSpreadsheet size={18} />
                )}
                Download Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailManagement;
