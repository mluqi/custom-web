import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Languages,
  Star,
  Wifi,
  Tv,
  Puzzle,
} from "lucide-react";
import api from "../../services/api";

const ServicePackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("id");

  const initialFormState = {
    category: "fiber",
    title: { id: "", en: "", cn: "" },
    speed: "",
    price: 0,
    original_price: 0,
    discount: { id: "", en: "", cn: "" },
    discount_note: { id: "", en: "", cn: "" },
    is_highlighted: false,
    display_order: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/service-packages");
      setPackages(response.data);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const i18nFields = ["title", "discount", "discount_note"];

    if (i18nFields.includes(name)) {
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setCurrentPackage(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setCurrentPackage(pkg);
    setFormData({
      category: pkg.category || "fiber",
      title: pkg.title || { id: "", en: "", cn: "" },
      speed: pkg.speed || "",
      price: pkg.price || 0,
      original_price: pkg.original_price || 0,
      discount: pkg.discount || { id: "", en: "", cn: "" },
      discount_note: pkg.discount_note || { id: "", en: "", cn: "" },
      is_highlighted: pkg.is_highlighted,
      display_order: pkg.display_order || 0,
    });
    setImageFile(null);
    setImagePreview(
      pkg.image
        ? pkg.image.startsWith("http")
          ? pkg.image
          : `${baseUrl}/uploads/${pkg.image}`
        : null,
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      const i18nFields = ["title", "discount", "discount_note"];
      if (i18nFields.includes(key)) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (currentPackage) {
        await api.put(`/service-packages/${currentPackage.id}`, data);
      } else {
        await api.post("/service-packages", data);
      }
      await fetchPackages();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving package:", error);
      alert("Gagal menyimpan paket layanan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPackage) return;
    setActionLoading(true);
    try {
      await api.delete(`/service-packages/${currentPackage.id}`);
      await fetchPackages();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Gagal menghapus paket layanan.");
    } finally {
      setActionLoading(false);
    }
  };

  const getCategoryUI = (category) => {
    switch (category) {
      case "fiber":
        return {
          icon: <Wifi size={14} />,
          text: "Fiber",
          color: "bg-blue-100 text-blue-700",
        };
      case "combo":
        return {
          icon: <Tv size={14} />,
          text: "Combo",
          color: "bg-purple-100 text-purple-700",
        };
      case "addon":
        return {
          icon: <Puzzle size={14} />,
          text: "Add-On",
          color: "bg-gray-100 text-gray-700",
        };
      default:
        return {
          icon: null,
          text: category,
          color: "bg-gray-100 text-gray-700",
        };
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Layanan
          </h1>
          <p className="text-gray-500">Kelola paket layanan yang ditawarkan</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tambah Paket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : packages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            Belum ada paket layanan yang ditambahkan.
          </div>
        ) : (
          packages.map((pkg) => {
            const categoryUI = getCategoryUI(pkg.category);
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-40 bg-gray-100">
                  <img
                    src={
                      pkg.image
                        ? pkg.image.startsWith("http")
                          ? pkg.image
                          : `${baseUrl}/uploads/${pkg.image}`
                        : "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={pkg.title?.id}
                    className="w-full h-full object-cover"
                  />
                  {pkg.is_highlighted && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg">
                      <Star size={14} />
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1">
                      {pkg.title?.id || pkg.title?.en || "No Title"}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${categoryUI.color}`}
                    >
                      {categoryUI.icon} {categoryUI.text}
                    </span>
                  </div>
                  <p className="text-sm text-teal-600 font-semibold mb-3">
                    {pkg.speed}
                  </p>
                  <div className="mb-4 flex-1">
                    <p className="text-2xl font-bold text-gray-800">
                      Rp{Number(pkg.price).toLocaleString("id-ID")}
                      <span className="text-sm font-normal text-gray-500">
                        /bulan
                      </span>
                    </p>
                    {pkg.original_price > 0 && (
                      <p className="text-sm text-red-500 line-through">
                        Rp{Number(pkg.original_price).toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(pkg)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPackage(pkg);
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
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {currentPackage ? "Edit Paket" : "Tambah Paket Baru"}
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
                    className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === lang ? "bg-teal-50 text-teal-700 border-b-2 border-teal-500" : "text-gray-500 hover:text-gray-700"}`}
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
                      Judul Paket ({activeTab.toUpperCase()})
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
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
                    >
                      <option value="fiber">Fiber Internet</option>
                      <option value="combo">Internet + TV Combo</option>
                      <option value="addon">Add-On</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kecepatan
                    </label>
                    <input
                      type="text"
                      name="speed"
                      value={formData.speed}
                      onChange={handleInputChange}
                      placeholder="Contoh: 50 Mbps"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Harga
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Harga Asli (Coret)
                      </label>
                      <input
                        type="number"
                        name="original_price"
                        value={formData.original_price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Paket
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label Diskon ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      name="discount"
                      value={formData.discount[activeTab] || ""}
                      onChange={handleInputChange}
                      placeholder="Contoh: Hemat Rp 50.000"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan Diskon ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      name="discount_note"
                      value={formData.discount_note[activeTab] || ""}
                      onChange={handleInputChange}
                      placeholder="Contoh: Harga belum PPN"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer mt-5">
                    <input
                      type="checkbox"
                      name="is_highlighted"
                      checked={formData.is_highlighted}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">
                      Jadikan Unggulan (Highlighted)
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
                Hapus Paket?
              </h3>
              <p className="text-gray-600 mb-6">
                Tindakan ini akan menghapus paket layanan ini secara permanen.
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

export default ServicePackageManagement;
