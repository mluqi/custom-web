import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../../services/api";

const ContentManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    display_order: 0,
    is_active: true,
  });
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [previews, setPreviews] = useState({ desktop: null, mobile: null });

  // Fetch Banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      // Sesuaikan endpoint dengan route yang Anda buat (misal: /content/banners)
      const response = await api.get("/content/banners");
      setBanners(response.data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handlers
  const openCreateModal = () => {
    setCurrentBanner(null);
    setFormData({ display_order: banners.length + 1, is_active: true });
    setDesktopFile(null);
    setMobileFile(null);
    setPreviews({ desktop: null, mobile: null });
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setCurrentBanner(banner);
    setFormData({
      display_order: banner.display_order,
      is_active: banner.is_active,
    });
    setDesktopFile(null);
    setMobileFile(null);
    // Asumsi URL gambar bisa diakses via endpoint static backend
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    setPreviews({
      desktop: banner.desktop_image
        ? `${baseUrl}/uploads/${banner.desktop_image}`
        : null,
      mobile: banner.mobile_image
        ? `${baseUrl}/uploads/${banner.mobile_image}`
        : null,
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "desktop") setDesktopFile(file);
      else setMobileFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const data = new FormData();
    data.append("display_order", formData.display_order);
    data.append("is_active", formData.is_active);
    if (desktopFile) data.append("desktop_image", desktopFile);
    if (mobileFile) data.append("mobile_image", mobileFile);

    try {
      if (currentBanner) {
        await api.put(`/content/banners/${currentBanner.id}`, data);
      } else {
        await api.post("/content/banners", data);
      }
      await fetchBanners();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Gagal menyimpan banner.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentBanner) return;
    setActionLoading(true);
    try {
      await api.delete(`/content/banners/${currentBanner.id}`);
      await fetchBanners();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Gagal menghapus banner.");
    } finally {
      setActionLoading(false);
    }
  };

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Konten</h1>
          <p className="text-gray-500">Kelola Hero Banner website</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tambah Banner
        </button>
      </div>

      {/* Banner List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            Belum ada banner yang ditambahkan.
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={`${baseUrl}/uploads/${banner.desktop_image}`}
                  alt="Desktop Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-bold ${
                      banner.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {banner.is_active ? "Aktif" : "Non-Aktif"}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Order: {banner.display_order}
                </div>
              </div>

              <div className="p-4 flex justify-between items-center">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Monitor size={14} /> Desktop & <Smartphone size={14} />{" "}
                  Mobile
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentBanner(banner);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {currentBanner ? "Edit Banner" : "Tambah Banner Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Desktop Image Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Monitor size={16} /> Gambar Desktop
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "desktop")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!currentBanner} // Required only on create
                    />
                    {previews.desktop ? (
                      <img
                        src={previews.desktop}
                        alt="Preview Desktop"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="py-8 text-gray-400 flex flex-col items-center">
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-xs">
                          Klik untuk upload (1920x1080px, Max 5MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Image Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Smartphone size={16} /> Gambar Mobile
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "mobile")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!currentBanner}
                    />
                    {previews.mobile ? (
                      <img
                        src={previews.mobile}
                        alt="Preview Mobile"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="py-8 text-gray-400 flex flex-col items-center">
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-xs">Klik untuk upload (750x1000px, Max 5MB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        is_active: !formData.is_active,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                      formData.is_active
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    {formData.is_active ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                    {formData.is_active ? "Aktif" : "Disembunyikan"}
                  </button>
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
                Hapus Banner?
              </h3>
              <p className="text-gray-600 mb-6">
                Tindakan ini akan menghapus gambar dari server dan tidak dapat
                dibatalkan.
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

export default ContentManagement;
