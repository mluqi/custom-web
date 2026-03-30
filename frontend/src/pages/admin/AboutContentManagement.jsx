import React, { useState, useEffect } from "react";
import {
  Edit,
  Save,
  Loader2,
  Image as ImageIcon,
  Languages,
  Plus,
  Trash2,
  X,
  Layout,
} from "lucide-react";
import api from "../../services/api";

const AboutContentManagement = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("id");

  const initialFormState = {
    title: { id: "", en: "", cn: "" },
    description: { id: "", en: "", cn: "" },
    items: [], // Array of objects
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // For additional images (Gallery)
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);
  const [keptImages, setKeptImages] = useState([]);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const fetchContents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/about/content");
      setContents(response.data);
    } catch (error) {
      console.error("Failed to fetch contents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["title", "description"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: { ...prev[name], [activeTab]: value },
      }));
    }
  };

  // Handle Items (Values List)
  const handleItemChange = (index, field, value, lang = null) => {
    const newItems = [...formData.items];
    if (lang) {
      newItems[index][field] = { ...newItems[index][field], [lang]: value };
    } else {
      newItems[index][field] = value;
    }
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { icon: "Heart", label: { id: "", en: "", cn: "" } },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Handle Main Image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle Additional Images
  const handleAdditionalFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalFiles((prev) => [...prev, ...files]);
  };

  const removeNewAdditionalFile = (index) => {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (filename) => {
    setKeptImages((prev) => prev.filter((img) => img !== filename));
  };

  const openEditModal = (content) => {
    setCurrentContent(content);
    setFormData({
      title: content.title || { id: "", en: "", cn: "" },
      description: content.description || { id: "", en: "", cn: "" },
      items: content.items || [],
    });
    
    // Main Image
    setImageFile(null);
    setImagePreview(
      content.image
        ? content.image.startsWith("http")
          ? content.image
          : `${baseUrl}/uploads/${content.image}`
        : null
    );

    // Additional Images
    setAdditionalFiles([]);
    const existing = content.additional_images || [];
    setExistingAdditionalImages(existing);
    setKeptImages(existing); // Initially keep all

    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const data = new FormData();
    data.append("title", JSON.stringify(formData.title));
    data.append("description", JSON.stringify(formData.description));
    data.append("items", JSON.stringify(formData.items));
    
    // Send list of images to KEEP
    data.append("kept_images", JSON.stringify(keptImages));

    if (imageFile) {
      data.append("image", imageFile);
    }

    // Append new additional images
    additionalFiles.forEach((file) => {
      data.append("additional_images", file);
    });

    try {
      await api.put(`/about/content/${currentContent.id}`, data);
      await fetchContents();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Gagal menyimpan konten.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Konten About Us</h1>
          <p className="text-gray-500">Edit konten halaman Tentang Kami per bagian</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : (
          contents.map((content) => (
            <div
              key={content.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-teal-600" />
                  <span className="font-bold text-gray-700 capitalize">
                    Section: {content.section}
                  </span>
                </div>
                <button
                  onClick={() => openEditModal(content)}
                  className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Edit size={16} />
                </button>
              </div>
              
              <div className="relative h-48 bg-gray-200">
                <img
                  src={
                    content.image
                      ? content.image.startsWith("http")
                        ? content.image
                        : `/uploads/${content.image}`
                      : "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={content.section}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex-1">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {content.title?.id || content.title?.en || "No Title"}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {content.description?.id || content.description?.en || "No Description"}
                </p>
                
                {content.items && content.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-500">Items: {content.items.length}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                Edit Section: <span className="capitalize">{currentContent?.section}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto">
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
                    {lang === "id" ? "Indonesia" : lang === "en" ? "English" : "Chinese"}
                  </button>
                ))}
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title[activeTab] || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
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

              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Utama
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Format: JPG, PNG, WEBP. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Images (Gallery) - Only if section supports it or has existing ones */}
              {(currentContent?.section === 'values' || existingAdditionalImages.length > 0) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Galeri Gambar Tambahan
                  </label>
                  
                  {/* Existing Images */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {keptImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden h-24 bg-gray-100">
                        <img 
                          src={img.startsWith("http") ? img : `/uploads/`} 
                          alt={`Gallery `} 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {/* New Files Preview */}
                    {additionalFiles.map((file, idx) => (
                      <div key={`new-`} className="relative group rounded-lg overflow-hidden h-24 bg-blue-50 border border-blue-200">
                        <div className="w-full h-full flex items-center justify-center text-xs text-blue-600 px-2 text-center">
                          {file.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewAdditionalFile(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAdditionalFilesChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}

              {/* Items List (Dynamic) - Only for sections that use it */}
              {currentContent?.section === 'values' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Daftar Nilai (Values)
                    </label>
                    <button
                      type="button"
                      onClick={addItem}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                    >
                      <Plus size={16} /> Tambah Item
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.items.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Icon Name (Lucide)</label>
                            <input
                              type="text"
                              value={item.icon}
                              onChange={(e) => handleItemChange(idx, 'icon', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                              placeholder="e.g. Heart, Users"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Label ({activeTab.toUpperCase()})</label>
                            <input
                              type="text"
                              value={item.label?.[activeTab] || ""}
                              onChange={(e) => handleItemChange(idx, 'label', e.target.value, activeTab)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutContentManagement;
