import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Languages,
  Image as ImageIcon,
  Layout,
} from "lucide-react";
import api from "../../services/api";

const DynamicServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [activeTab, setActiveTab] = useState("id");
  const [actionLoading, setActionLoading] = useState(false);

  const initialForm = {
    slug: "",
    template: "template1",
    title: { id: "", en: "", cn: "" },
    subtitle: { id: "", en: "", cn: "" },
    description: { id: "", en: "", cn: "" },
    content: { p1: { id: "", en: "", cn: "" }, p2: { id: "", en: "", cn: "" } },
    features: [], // [{title: {id...}, description: {id...}}]
    cta_text: { id: "Hubungi Kami", en: "Contact Us", cn: "联系我们" },
    cta_link: "/contact",
    image: null,
    secondary_image: null,
  };

  const [formData, setFormData] = useState(initialForm);
  const [previews, setPreviews] = useState({
    image: null,
    secondary_image: null,
  });

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/dynamic-services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
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

  const handleContentChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: { ...(prev.content[key] || {}), [activeTab]: value },
      },
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const handleFeatureChange = (idx, field, value) => {
    const newFeatures = [...formData.features];
    if (!newFeatures[idx][field]) newFeatures[idx][field] = {};
    newFeatures[idx][field][activeTab] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          title: { id: "", en: "", cn: "" },
          description: { id: "", en: "", cn: "" },
        },
      ],
    }));
  };

  const removeFeature = (idx) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const data = new FormData();

    // Append simple fields
    data.append("slug", formData.slug);
    data.append("template", formData.template);
    data.append("cta_link", formData.cta_link);

    // Append JSON fields
    [
      "title",
      "subtitle",
      "description",
      "content",
      "features",
      "cta_text",
    ].forEach((key) => {
      data.append(key, JSON.stringify(formData[key]));
    });

    // Append files
    if (formData.image instanceof File) data.append("image", formData.image);
    if (formData.secondary_image instanceof File)
      data.append("secondary_image", formData.secondary_image);

    try {
      if (currentService) {
        await api.put(`/dynamic-services/${currentService.id}`, data);
      } else {
        await api.post("/dynamic-services", data);
      }
      await fetchServices();
      setIsModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan data");
    } finally {
      setActionLoading(false);
    }
  };

  const openEdit = (service) => {
    setCurrentService(service);
    setFormData({
      ...initialForm,
      ...service,
      image: service.image, // Keep string url/filename
      secondary_image: service.secondary_image,
    });
    setPreviews({
      image: service.image
        ? service.image.startsWith("http")
          ? service.image
          : `${baseUrl}/uploads/${service.image}`
        : null,
      secondary_image: service.secondary_image
        ? service.secondary_image.startsWith("http")
          ? service.secondary_image
          : `${baseUrl}/uploads/${service.secondary_image}`
        : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus layanan ini?")) return;
    try {
      await api.delete(`/dynamic-services/`);
      fetchServices();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Layanan Dinamis</h1>
        <button
          onClick={() => {
            setCurrentService(null);
            setFormData(initialForm);
            setPreviews({ image: null, secondary_image: null });
            setIsModalOpen(true);
          }}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Tambah Layanan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-100"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded uppercase">
                {service.template}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(service)}
                  className="text-blue-600"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg">
              {service.title?.id || service.title?.en}
            </h3>
            <p className="text-gray-500 text-sm mb-2">/{service.slug}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between">
              <h2 className="text-xl font-bold">
                {currentService ? "Edit Layanan" : "Tambah Layanan"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange(e, "slug")}
                    className="w-full border p-2 rounded"
                    placeholder="contoh: dedicated-server"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Template Layout
                  </label>
                  <select
                    value={formData.template}
                    onChange={(e) => handleInputChange(e, "template")}
                    className="w-full border p-2 rounded"
                  >
                    <option value="template1">
                      Template 1 (Wifi Hotspot Style)
                    </option>
                    <option value="template2">
                      Template 2 (Internet Business Style)
                    </option>
                    <option value="template3">Template 3 (Simple Style)</option>
                  </select>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="flex gap-2 border-b">
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
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Deskripsi Utama ({activeTab})
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

                {/* Dynamic Content Fields based on Template */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2 text-sm text-gray-700">
                    Konten Tambahan
                  </h4>
                  <div className="grid gap-3">
                    <input
                      type="text"
                      placeholder={`Paragraf 1 ()`}
                      value={formData.content.p1?.[activeTab] || ""}
                      onChange={(e) =>
                        handleContentChange("p1", e.target.value)
                      }
                      className="w-full border p-2 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder={`Paragraf 2 ()`}
                      value={formData.content.p2?.[activeTab] || ""}
                      onChange={(e) =>
                        handleContentChange("p2", e.target.value)
                      }
                      className="w-full border p-2 rounded text-sm"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      Fitur / Poin ({activeTab})
                    </label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-xs text-teal-600 flex items-center gap-1"
                    >
                      <Plus size={14} /> Tambah
                    </button>
                  </div>
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Judul Fitur"
                        value={feat.title[activeTab] || ""}
                        onChange={(e) =>
                          handleFeatureChange(idx, "title", e.target.value)
                        }
                        className="flex-1 border p-2 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Deskripsi Singkat"
                        value={feat.description[activeTab] || ""}
                        onChange={(e) =>
                          handleFeatureChange(
                            idx,
                            "description",
                            e.target.value,
                          )
                        }
                        className="flex-1 border p-2 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gambar Utama (Hero)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "image")}
                    className="text-sm"
                  />
                  {previews.image && (
                    <img
                      src={previews.image}
                      className="h-20 mt-2 object-cover rounded"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gambar Sekunder (Content)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "secondary_image")}
                    className="text-sm"
                  />
                  {previews.secondary_image && (
                    <img
                      src={previews.secondary_image}
                      className="h-20 mt-2 object-cover rounded"
                    />
                  )}
                </div>
              </div>

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

export default DynamicServiceManagement;
