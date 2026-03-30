import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../../services/api";

const PartnerManagement = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const initialFormState = {
    name: "",
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const fetchPartners = async () => {
    setLoading(true);
    try {
      // Menggunakan parameter show_all=true agar admin bisa melihat semua partner
      const response = await api.get("/partners?show_all=true");
      setPartners(response.data);
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setCurrentPartner(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (partner) => {
    setCurrentPartner(partner);
    setFormData({
      name: partner.name || "",
      is_active: partner.is_active,
    });
    setImageFile(null);
    setImagePreview(
      partner.logo
        ? partner.logo.startsWith("http")
          ? partner.logo
          : `${baseUrl}/uploads/${partner.logo}`
        : null,
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("is_active", formData.is_active);

    if (imageFile) {
      data.append("logo", imageFile);
    }

    try {
      if (currentPartner) {
        await api.put(`/partners/${currentPartner.id}`, data);
      } else {
        await api.post("/partners", data);
      }
      await fetchPartners();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving partner:", error);
      alert("Gagal menyimpan data partner.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPartner) return;
    setActionLoading(true);
    try {
      await api.delete(`/partners/${currentPartner.id}`);
      await fetchPartners();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting partner:", error);
      alert("Gagal menghapus partner.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Mitra</h1>
          <p className="text-gray-500">
            Kelola daftar partner dan klien perusahaan
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tambah Mitra
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : partners.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            Belum ada mitra yang ditambahkan.
          </div>
        ) : (
          partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-32 bg-gray-50 p-4 flex items-center justify-center">
                <img
                  src={
                    partner.logo
                      ? partner.logo.startsWith("http")
                        ? partner.logo
                        : `${baseUrl}/uploads/${partner.logo}`
                      : "https://placehold.co/400x400?text=No+Logo"
                  }
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
                      partner.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {partner.is_active ? "Aktif" : "Non-Aktif"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-center mb-4 line-clamp-2">
                  {partner.name}
                </h3>

                <div className="flex items-center justify-center gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(partner)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPartner(partner);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {currentPartner ? "Edit Mitra" : "Tambah Mitra Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Mitra
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    required
                    placeholder="Contoh: PT. Teknologi Maju"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Mitra
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50 h-40 flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!currentPartner} // Wajib jika membuat baru
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-xs">Klik untuk upload logo</span>
                      </div>
                    )}
                  </div>
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
                      Tampilkan di Website (Aktif)
                    </span>
                  </label>
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Hapus Mitra?
              </h3>
              <p className="text-gray-600 mb-6">
                Tindakan ini akan menghapus data mitra ini secara permanen.
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

export default PartnerManagement;
