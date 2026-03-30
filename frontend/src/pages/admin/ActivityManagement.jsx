import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Languages,
  Calendar,
  MapPin,
} from "lucide-react";
import api from "../../services/api";

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("id"); // 'id', 'en', 'cn'

  const initialFormState = {
    title: { id: "", en: "", cn: "" },
    description: { id: "", en: "", cn: "" },
    category: "",
    location: "",
    date: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const quillRef = useRef(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await api.get("/activity");
      setActivities(response.data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["title"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: { ...prev[name], [activeTab]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, [activeTab]: content },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setCurrentActivity(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setCurrentActivity(activity);
    setFormData({
      title: activity.title || { id: "", en: "", cn: "" },
      description: activity.description || { id: "", en: "", cn: "" },
      category: activity.category || "",
      location: activity.location || "",
      date: activity.date
        ? new Date(activity.date).toISOString().split("T")[0]
        : "",
    });
    setImageFile(null);
    setImagePreview(
      activity.image
        ? activity.image.startsWith("http")
          ? activity.image
          : `${baseUrl}/uploads/${activity.image}`
        : null,
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const data = new FormData();
    data.append("title", JSON.stringify(formData.title));
    data.append("description", JSON.stringify(formData.description));
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("date", formData.date);

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (currentActivity) {
        await api.put(`/activity/${currentActivity.id}`, data);
      } else {
        await api.post("/activity", data);
      }
      await fetchActivities();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving activity:", error);
      alert("Gagal menyimpan aktivitas.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentActivity) return;
    setActionLoading(true);
    try {
      await api.delete(`/activity/${currentActivity.id}`);
      await fetchActivities();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Gagal menghapus aktivitas.");
    } finally {
      setActionLoading(false);
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
      ],
    }),
    [],
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Aktivitas
          </h1>
          <p className="text-gray-500">Kelola kegiatan dan acara perusahaan</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tambah Kegiatan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : activities.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            Belum ada aktivitas yang ditambahkan.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-48 bg-gray-100">
                <img
                  src={
                    activity.image
                      ? activity.image.startsWith("http")
                        ? activity.image
                        : `${baseUrl}/uploads/${activity.image}`
                      : "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={activity.title?.id}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-teal-600 shadow-sm">
                  {activity.category}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(activity.date).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3 h-3" />
                    <span>{activity.location}</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {activity.title?.id || activity.title?.en || "No Title"}
                </h3>

                <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(activity)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentActivity(activity);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {currentActivity ? "Edit Aktivitas" : "Tambah Aktivitas Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 overflow-y-auto"
            >
              <div className="flex gap-2 border-b border-gray-200 pb-1">
                {["id", "en", "cn"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                      activeTab === lang
                        ? "bg-teal-50 text-teal-700 border-b-2 border-teal-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Languages size={16} />{" "}
                    {lang === "id"
                      ? "Indonesia"
                      : lang === "en"
                        ? "English"
                        : "Chinese"}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Kegiatan ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title[activeTab] || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Contoh: CSR, Internal, Workshop"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Kegiatan
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50 h-64 flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-xs">Upload Gambar</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi ({activeTab.toUpperCase()})
                </label>
                <div className="h-64 mb-12">
                  <ReactQuill
                    ref={quillRef}
                    key={activeTab}
                    theme="snow"
                    value={formData.description[activeTab] || ""}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    className="h-full"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  )}{" "}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Hapus Aktivitas?
              </h3>
              <p className="text-gray-600 mb-6">
                Tindakan ini akan menghapus aktivitas ini secara permanen.
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

export default ActivityManagement;
