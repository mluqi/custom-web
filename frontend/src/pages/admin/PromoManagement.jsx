import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Calendar,
  Languages,
  Percent,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../../services/api";

const PromoManagement = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("id"); // 'id', 'en', 'cn'

  const initialFormState = {
    title: { id: "", en: "", cn: "" },
    description: { id: "", en: "", cn: "" },
    discount: "",
    valid_until: "",
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch Promos
  const fetchPromos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/promos");
      setPromos(response.data);
    } catch (error) {
      console.error("Failed to fetch promos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["title", "description"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: { ...prev[name], [activeTab]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
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
    setCurrentPromo(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (promo) => {
    setCurrentPromo(promo);
    setFormData({
      title: promo.title || { id: "", en: "", cn: "" },
      description: promo.description || { id: "", en: "", cn: "" },
      discount: promo.discount || "",
      valid_until: promo.valid_until
        ? new Date(promo.valid_until).toISOString().split("T")[0]
        : "",
      is_active: promo.is_active,
    });
    setImageFile(null);
    setImagePreview(
      promo.image
        ? promo.image.startsWith("http")
          ? promo.image
          : `${baseUrl}/uploads/${promo.image}`
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
    data.append("discount", formData.discount);
    data.append("valid_until", formData.valid_until);
    data.append("is_active", formData.is_active);

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (currentPromo) {
        await api.put(`/promos/${currentPromo.id}`, data);
      } else {
        await api.post("/promos", data);
      }
      await fetchPromos();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving promo:", error);
      alert("Gagal menyimpan promo.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPromo) return;
    setActionLoading(true);
    try {
      await api.delete(`/promos/${currentPromo.id}`);
      await fetchPromos();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting promo:", error);
      alert("Gagal menghapus promo.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Promo</h1>
          <p className="text-gray-500">Kelola promo dan penawaran spesial</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tambah Promo
        </button>
      </div>

      {/* Promo List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : promos.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            Belum ada promo yang ditambahkan.
          </div>
        ) : (
          promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-48 bg-gray-100">
                <img
                  src={
                    promo.image
                      ? promo.image.startsWith("http")
                        ? promo.image
                        : `${baseUrl}/uploads/${promo.image}`
                      : "https://placehold.co/600x400?text=No+Image"
                  }
                  alt="Promo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-bold ${
                      promo.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {promo.is_active ? "Aktif" : "Non-Aktif"}
                  </span>
                </div>
                {promo.discount && (
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-teal-600 shadow-sm flex items-center gap-1">
                    <Percent size={12} />
                    {promo.discount}
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                  {promo.title?.id || promo.title?.en || "No Title"}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                  {promo.description?.id || promo.description?.en || ""}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {promo.valid_until
                      ? new Date(promo.valid_until).toLocaleDateString("id-ID")
                      : "Selamanya"}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(promo)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPromo(promo);
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {currentPromo ? "Edit Promo" : "Tambah Promo Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Language Tabs */}
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
                    <Languages size={16} />
                    {lang === "id"
                      ? "Indonesia"
                      : lang === "en"
                        ? "English"
                        : "Chinese"}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Promo ({activeTab.toUpperCase()})
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
                    Deskripsi ({activeTab.toUpperCase()})
                  </label>
                  <textarea
                    name="description"
                    value={formData.description[activeTab] || ""}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Promo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50 h-32 flex items-center justify-center">
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
                        <ImageIcon size={24} className="mb-1" />
                        <span className="text-xs">Upload Gambar</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label Diskon
                    </label>
                    <input
                      type="text"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="Contoh: 50% OFF"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Berlaku Hingga
                    </label>
                    <input
                      type="date"
                      name="valid_until"
                      value={formData.valid_until}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">
                        Status Aktif
                      </span>
                    </label>
                  </div>
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
                  )}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Hapus Promo?
              </h3>
              <p className="text-gray-600 mb-6">
                Tindakan ini akan menghapus promo ini secara permanen.
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

export default PromoManagement;
