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
  Rocket,
  Globe,
  ShieldCheck,
  Headphones,
  Home,
  Building2,
  Wifi,
  Zap,
  CheckCircle2,
  MapPin,
  Search,
} from "lucide-react";
import api from "../../services/api";

const InternetContentManagement = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("id");

  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [itemImageFiles, setItemImageFiles] = useState({}); // Untuk gambar item services
  const [imagePreview, setImagePreview] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchContents();
  }, []);

  // Icon Options
  const iconOptions = [
    { name: "Rocket", component: <Rocket size={20} /> },
    { name: "Globe", component: <Globe size={20} /> },
    { name: "ShieldCheck", component: <ShieldCheck size={20} /> },
    { name: "Headphones", component: <Headphones size={20} /> },
    { name: "Home", component: <Home size={20} /> },
    { name: "Building2", component: <Building2 size={20} /> },
    { name: "Wifi", component: <Wifi size={20} /> },
    { name: "Zap", component: <Zap size={20} /> },
    { name: "CheckCircle2", component: <CheckCircle2 size={20} /> },
    { name: "MapPin", component: <MapPin size={20} /> },
    { name: "Search", component: <Search size={20} /> },
  ];

  const fetchContents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/internet-content");
      setContents(response.data);
    } catch (error) {
      console.error("Failed to fetch contents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, field, nestedField = null) => {
    const value = e.target.value;
    if (nestedField) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [nestedField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleExtraDataChange = (field, value, lang = null) => {
    const newExtra = { ...formData.extra_data };
    if (lang) newExtra[field] = { ...newExtra[field], [lang]: value };
    else newExtra[field] = value;
    setFormData((prev) => ({ ...prev, extra_data: newExtra }));
  };

  const handleItemChange = (index, field, value, lang = null) => {
    const newItems = [...formData.items];
    if (lang) {
      newItems[index][field] = { ...newItems[index][field], [lang]: value };
    } else {
      newItems[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleItemFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setItemImageFiles((prev) => ({ ...prev, [index]: file }));
      // Update preview di state items sementara
      const newItems = [...formData.items];
      newItems[index] = {
        ...newItems[index],
        imagePreview: URL.createObjectURL(file),
      };
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const openEdit = (content) => {
    setCurrentContent(content);
    setFormData({
      title: content.title || {},
      subtitle: content.subtitle || {},
      description: content.description || {},
      items: content.items || [],
      extra_data: content.extra_data || {},
    });
    setImageFile(null);
    setItemImageFiles({});
    setImagePreview(
      content.image
        ? content.image.startsWith("http")
          ? content.image
          : `${baseUrl}/uploads/${content.image}`
        : null,
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const data = new FormData();

    ["title", "subtitle", "description", "items", "extra_data"].forEach(
      (key) => {
        data.append(key, JSON.stringify(formData[key]));
      },
    );

    if (imageFile) data.append("image", imageFile);

    Object.keys(itemImageFiles).forEach((index) => {
      data.append(`item_image_${index}`, itemImageFiles[index]);
    });

    try {
      await api.put(`/internet-content/${currentContent.id}`, data);
      await fetchContents();
      setIsModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan data");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to render dynamic item fields based on section
  const renderItemFields = (item, idx) => {
    if (currentContent.section === "why_us") {
      return (
        <>
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => handleItemChange(idx, "icon", opt.name)}
                  className={`p-2 rounded border ${item.icon === opt.name ? "bg-teal-50 border-teal-500 text-teal-600" : "bg-white border-gray-200 text-gray-500"}`}
                  title={opt.name}
                >
                  {opt.component}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder={`Title ()`}
            value={item.title?.[activeTab] || ""}
            onChange={(e) =>
              handleItemChange(idx, "title", e.target.value, activeTab)
            }
            className="w-full border p-2 rounded mb-2 text-sm"
          />
          <textarea
            placeholder={`Desc ()`}
            value={item.description?.[activeTab] || ""}
            onChange={(e) =>
              handleItemChange(idx, "description", e.target.value, activeTab)
            }
            className="w-full border p-2 rounded text-sm"
            rows="2"
          />
        </>
      );
    }
    if (currentContent.section === "faq") {
      return (
        <>
          <input
            type="text"
            placeholder={`Question ()`}
            value={item.question?.[activeTab] || ""}
            onChange={(e) =>
              handleItemChange(idx, "question", e.target.value, activeTab)
            }
            className="w-full border p-2 rounded mb-2 text-sm"
          />
          <textarea
            placeholder={`Answer ()`}
            value={item.answer?.[activeTab] || ""}
            onChange={(e) =>
              handleItemChange(idx, "answer", e.target.value, activeTab)
            }
            className="w-full border p-2 rounded text-sm"
            rows="2"
          />
        </>
      );
    }
    // Services
    if (currentContent.section === "services") {
      return (
        <>
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => handleItemChange(idx, "icon", opt.name)}
                  className={`p-2 rounded border ${item.icon === opt.name ? "bg-teal-50 border-teal-500 text-teal-600" : "bg-white border-gray-200 text-gray-500"}`}
                  title={opt.name}
                >
                  {opt.component}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder={`Title (${activeTab})`}
            value={item.title?.[activeTab] || ""}
            onChange={(e) =>
              handleItemChange(idx, "title", e.target.value, activeTab)
            }
            className="w-full border p-2 rounded mb-2 text-sm"
          />
          <textarea
            placeholder={`Desc (${activeTab})`}
            value={item.description?.[activeTab] || ""}
            onChange={(e) =>
              handleItemChange(idx, "description", e.target.value, activeTab)
            }
            className="w-full border p-2 rounded mb-2 text-sm"
            rows="2"
          />
          <input
            type="text"
            placeholder="Link URL (e.g. /internet-home)"
            value={item.link || ""}
            onChange={(e) => handleItemChange(idx, "link", e.target.value)}
            className="w-full border p-2 rounded mb-2 text-sm"
          />
          <div className="flex items-center gap-2">
            {item.image && !item.imagePreview && (
              <img
                src={
                  item.image.startsWith("http")
                    ? item.image
                    : `${baseUrl}/uploads/${item.image}`
                }
                className="h-10 w-10 object-cover rounded"
              />
            )}
            {item.imagePreview && (
              <img
                src={item.imagePreview}
                className="h-10 w-10 object-cover rounded"
              />
            )}
            <input
              type="file"
              onChange={(e) => handleItemFileChange(idx, e)}
              className="text-xs"
            />
          </div>

          {/* Features List Editor */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Features List ({activeTab.toUpperCase()})
            </label>
            <div className="space-y-2">
              {(item.features || []).map((feature, fIdx) => (
                <div key={fIdx} className="flex gap-2 items-center">
                  <div className="p-1.5 bg-gray-100 rounded text-gray-400">
                    <CheckCircle2 size={14} />
                  </div>
                  <input
                    type="text"
                    value={
                      typeof feature === "object"
                        ? feature[activeTab] || ""
                        : feature
                    }
                    onChange={(e) => {
                      const newFeatures = [...(item.features || [])];
                      const val = e.target.value;
                      // Handle localization object structure
                      if (typeof newFeatures[fIdx] !== "object") {
                        newFeatures[fIdx] = { id: newFeatures[fIdx], en: newFeatures[fIdx], cn: newFeatures[fIdx] };
                      }
                      newFeatures[fIdx] = { ...newFeatures[fIdx], [activeTab]: val };
                      handleItemChange(idx, "features", newFeatures);
                    }}
                    className="flex-1 border p-2 rounded text-sm focus:outline-none focus:border-teal-500"
                    placeholder="Feature description"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = (item.features || []).filter((_, i) => i !== fIdx);
                      handleItemChange(idx, "features", newFeatures);
                    }}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newFeatures = [...(item.features || []), { id: "", en: "", cn: "" }];
                  handleItemChange(idx, "features", newFeatures);
                }}
                className="text-xs text-teal-600 flex items-center gap-1 font-medium mt-1 hover:text-teal-700"
              >
                <Plus size={14} /> Add Feature
              </button>
            </div>
          </div>
        </>
      );
    }

    // Default fallback
    return (
      <>
        <input
          type="text"
          placeholder={`Title ()`}
          value={item.title?.[activeTab] || ""}
          onChange={(e) =>
            handleItemChange(idx, "title", e.target.value, activeTab)
          }
          className="w-full border p-2 rounded mb-2 text-sm"
        />
        <textarea
          placeholder={`Desc ()`}
          value={item.description?.[activeTab] || ""}
          onChange={(e) =>
            handleItemChange(idx, "description", e.target.value, activeTab)
          }
          className="w-full border p-2 rounded text-sm"
          rows="2"
        />
      </>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen Halaman Internet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => (
          <div
            key={content.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold uppercase text-teal-600">
                {content.section.replace("_", " ")}
              </span>
              <button
                onClick={() => openEdit(content)}
                className="text-blue-600 hover:bg-blue-50 p-2 rounded"
              >
                <Edit size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {content.title?.id || "No Title"}
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between">
              <h2 className="text-xl font-bold capitalize">
                Edit {currentContent?.section.replace("_", " ")}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex gap-2 border-b pb-2">
                {["id", "en", "cn"].map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 ${activeTab === lang ? "border-b-2 border-teal-500 text-teal-600 font-bold" : "text-gray-500"}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Judul ({activeTab})
                  </label>
                  <input
                    type="text"
                    value={formData.title[activeTab] || ""}
                    onChange={(e) => handleInputChange(e, "title", activeTab)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Sub Judul ({activeTab})
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle[activeTab] || ""}
                    onChange={(e) =>
                      handleInputChange(e, "subtitle", activeTab)
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                {currentContent?.section === "hero" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Deskripsi ({activeTab})
                    </label>
                    <textarea
                      rows="3"
                      value={formData.description[activeTab] || ""}
                      onChange={(e) =>
                        handleInputChange(e, "description", activeTab)
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>
                )}

                {/* Hero Extra Data (CTA Links) */}
                {currentContent?.section === "hero" && (
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Teks Tombol 1 ({activeTab})
                      </label>
                      <input
                        type="text"
                        value={formData.extra_data?.btnHome?.[activeTab] || ""}
                        onChange={(e) =>
                          handleExtraDataChange(
                            "btnHome",
                            e.target.value,
                            activeTab,
                          )
                        }
                        className="w-full border p-2 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Link URL 1"
                        value={formData.extra_data?.btnHomeLink || ""}
                        onChange={(e) =>
                          handleExtraDataChange("btnHomeLink", e.target.value)
                        }
                        className="w-full border p-2 rounded text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Teks Tombol 2 ({activeTab})
                      </label>
                      <input
                        type="text"
                        value={
                          formData.extra_data?.btnBusiness?.[activeTab] || ""
                        }
                        onChange={(e) =>
                          handleExtraDataChange(
                            "btnBusiness",
                            e.target.value,
                            activeTab,
                          )
                        }
                        className="w-full border p-2 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Link URL 2"
                        value={formData.extra_data?.btnBusinessLink || ""}
                        onChange={(e) =>
                          handleExtraDataChange(
                            "btnBusinessLink",
                            e.target.value,
                          )
                        }
                        className="w-full border p-2 rounded text-sm mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* CTA Extra Data */}
                {currentContent?.section === "cta" && (
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Teks Tombol 1 ({activeTab})
                      </label>
                      <input
                        type="text"
                        value={formData.extra_data?.btnSales?.[activeTab] || ""}
                        onChange={e => handleExtraDataChange('btnSales', e.target.value, activeTab)}
                        className="w-full border p-2 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Link URL 1 (e.g. /contact)"
                        value={formData.extra_data?.btnSalesLink || ""}
                        onChange={e => handleExtraDataChange('btnSalesLink', e.target.value)}
                        className="w-full border p-2 rounded text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Teks Tombol 2 ({activeTab})
                      </label>
                      <input
                        type="text"
                        value={formData.extra_data?.btnChat?.[activeTab] || ""}
                        onChange={e => handleExtraDataChange('btnChat', e.target.value, activeTab)}
                        className="w-full border p-2 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Link URL 2 (e.g. https://wa.me/...)"
                        value={formData.extra_data?.btnChatLink || ""}
                        onChange={e => handleExtraDataChange('btnChatLink', e.target.value)}
                        className="w-full border p-2 rounded text-sm mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload for Hero/Services */}
              {["hero"].includes(currentContent?.section) && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gambar Background
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="text-sm"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      className="h-32 mt-2 object-cover rounded"
                    />
                  )}
                </div>
              )}

              {/* Items Editor */}
              {["why_us", "faq", "services"].includes(
                currentContent?.section,
              ) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <label className="font-medium">Daftar Item</label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          items: [...prev.items, {}],
                        }))
                      }
                      className="text-xs text-teal-600 flex items-center gap-1"
                    >
                      <Plus size={14} /> Tambah
                    </button>
                  </div>
                  {formData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded border mb-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            items: prev.items.filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute top-2 right-2 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                      {renderItemFields(item, idx)}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  {actionLoading ? (
                    <Loader2 className="animate-spin" size={18} />
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
    </div>
  );
};

export default InternetContentManagement;
