import React, { useState, useEffect } from "react";
import {
  Layout,
  Save,
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  Loader2,
  X,
  Languages,
  MonitorPlay,
  Tv,
  Globe,
  Link as LinkIcon,
  Palette,
} from "lucide-react";
import api from "../../services/api";

const Entertainment = () => {
  const [activeTab, setActiveTab] = useState("header"); // header, platform, channel
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState("id");
  const [saving, setSaving] = useState(false);

  // Header Specific State
  const [headerData, setHeaderData] = useState({
    id: null,
    title: { id: "", en: "", cn: "" },
    subtitle: { id: "", en: "", cn: "" },
    description: { id: "", en: "", cn: "" },
    header_text: { id: "", en: "", cn: "" }, // stored in meta
    image: null,
    imagePreview: null,
  });

  // Modal State (for Platforms & Channels)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: { id: "", en: "", cn: "" },
    url: "",
    color: "#000000", // stored in meta for platform
    image: null,
    imagePreview: null,
  });

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/entertainment");
      setItems(response.data);

      // Populate Header Data
      const header = response.data.find((item) => item.category === "header");
      if (header) {
        const parse = (str) => {
          try {
            return typeof str === "string" ? JSON.parse(str) : str;
          } catch {
            return { id: "", en: "", cn: "" };
          }
        };
        const meta = parse(header.meta);

        setHeaderData({
          id: header.id,
          title: parse(header.title),
          subtitle: parse(header.subtitle),
          description: parse(header.description),
          header_text: meta.header_text || { id: "", en: "", cn: "" },
          image: header.image,
          imagePreview: header.image
            ? header.image.startsWith("http")
              ? header.image
              : `${baseUrl}/uploads/${header.image}`
            : null,
        });
      }
    } catch (error) {
      console.error("Failed to fetch entertainment data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Helper Functions ---

  const parseJson = (data) => {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return {};
    }
  };

  const getLocalized = (data, lang) => {
    const parsed = parseJson(data);
    return parsed?.[lang] || parsed?.["id"] || "";
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Header Actions ---

  const handleHeaderChange = (field, value, lang = null) => {
    setHeaderData((prev) => {
      if (lang) {
        return {
          ...prev,
          [field]: { ...prev[field], [lang]: value },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const saveHeader = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("category", "header");
      formData.append("title", JSON.stringify(headerData.title));
      formData.append("subtitle", JSON.stringify(headerData.subtitle));
      formData.append("description", JSON.stringify(headerData.description));
      formData.append(
        "meta",
        JSON.stringify({ header_text: headerData.header_text }),
      );

      if (headerData.image instanceof File) {
        formData.append("image", headerData.image);
      }

      if (headerData.id) {
        await api.put(`/entertainment/${headerData.id}`, formData);
      } else {
        await api.post("/entertainment", formData);
      }
      alert("Header updated successfully!");
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to save header.");
    } finally {
      setSaving(false);
    }
  };

  // --- Platform/Channel Actions ---

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      const title = parseJson(item.title);
      const meta = parseJson(item.meta);
      setFormData({
        title: title || { id: "", en: "", cn: "" },
        url: item.url || "",
        color: meta?.color || "#000000",
        image: item.image,
        imagePreview: item.image
          ? item.image.startsWith("http")
            ? item.image
            : `${baseUrl}/uploads/${item.image}`
          : null,
      });
    } else {
      setFormData({
        title: { id: "", en: "", cn: "" },
        url: "",
        color: "#000000",
        image: null,
        imagePreview: null,
      });
    }
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      const category = activeTab === "platforms" ? "platform" : "channel";
      data.append("category", category);
      data.append("title", JSON.stringify(formData.title));
      data.append("url", formData.url);

      if (category === "platform") {
        data.append("meta", JSON.stringify({ color: formData.color }));
      }

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      // Set order (simple append to end)
      if (!editingItem) {
        const currentItems = items.filter((i) => i.category === category);
        data.append("order", currentItems.length + 1);
      }

      if (editingItem) {
        await api.put(`/entertainment/${editingItem.id}`, data);
      } else {
        await api.post("/entertainment", data);
      }

      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to save item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/entertainment/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete item.");
    }
  };

  // --- Renderers ---

  const renderLanguageTabs = () => (
    <div className="flex gap-2 mb-4">
      {["id", "en", "cn"].map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setActiveLang(lang)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors ${
            activeLang === lang
              ? "bg-teal-100 text-teal-700 border border-teal-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Languages size={14} />
          {lang === "id" ? "Indonesia" : lang === "en" ? "English" : "Chinese"}
        </button>
      ))}
    </div>
  );

  const renderHeaderTab = () => (
    <form onSubmit={saveHeader} className="max-w-4xl">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
            <Layout size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Header Section</h3>
            <p className="text-sm text-gray-500">
              Manage the main title and description of the Entertainment page.
            </p>
          </div>
        </div>

        {renderLanguageTabs()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Small Header Text ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={headerData.header_text[activeLang] || ""}
                onChange={(e) =>
                  handleHeaderChange("header_text", e.target.value, activeLang)
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Title ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={headerData.title[activeLang] || ""}
                onChange={(e) =>
                  handleHeaderChange("title", e.target.value, activeLang)
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle ({activeLang.toUpperCase()})
              </label>
              <textarea
                rows="2"
                value={headerData.subtitle[activeLang] || ""}
                onChange={(e) =>
                  handleHeaderChange("subtitle", e.target.value, activeLang)
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description Box ({activeLang.toUpperCase()})
              </label>
              <textarea
                rows="3"
                value={headerData.description[activeLang] || ""}
                onChange={(e) =>
                  handleHeaderChange("description", e.target.value, activeLang)
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50 h-64 flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setHeaderData)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {headerData.imagePreview ? (
                <img
                  src={headerData.imagePreview}
                  alt="Preview"
                  className="h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-xs">Click to upload image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );

  const renderListTab = (type) => {
    const category = type === "platforms" ? "platform" : "channel";
    const filteredItems = items.filter((i) => i.category === category);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800 capitalize">
              {type} List
            </h3>
            <p className="text-sm text-gray-500">
              Manage {type} displayed on the page.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <Plus size={18} /> Add New
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3 relative group hover:shadow-md transition-shadow"
            >
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openModal(item)}
                  className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="h-16 w-full flex items-center justify-center bg-gray-50 rounded-lg p-2">
                {item.image ? (
                  <img
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `${baseUrl}/uploads/${item.image}`
                    }
                    alt={getLocalized(item.title, "id")}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <ImageIcon className="text-gray-300" />
                )}
              </div>
              <p className="text-sm font-medium text-center truncate w-full">
                {getLocalized(item.title, "id")}
              </p>
              {type === "platforms" && (
                <div
                  className="w-full h-1 rounded-full"
                  style={{
                    backgroundColor: parseJson(item.meta)?.color || "#eee",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Entertainment Page</h1>
        <p className="text-gray-500">
          Manage content for the Entertainment section (Streaming & TV).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("header")}
          className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "header"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Layout size={18} /> Header
        </button>
        <button
          onClick={() => setActiveTab("platforms")}
          className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "platforms"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <MonitorPlay size={18} /> Streaming Platforms
        </button>
        <button
          onClick={() => setActiveTab("channels")}
          className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "channels"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Tv size={18} /> TV Channels
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        </div>
      ) : (
        <>
          {activeTab === "header" && renderHeaderTab()}
          {activeTab === "platforms" && renderListTab("platforms")}
          {activeTab === "channels" && renderListTab("channels")}
        </>
      )}

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              {renderLanguageTabs()}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  required
                  value={formData.title[activeLang] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: { ...prev.title, [activeLang]: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              {activeTab === "platforms" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Link
                    </label>
                    <div className="relative">
                      <LinkIcon
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) =>
                          setFormData({ ...formData, url: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        className="h-10 w-14 cursor-pointer rounded border border-gray-200 p-1"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 uppercase"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50 h-32 flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFormData)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <ImageIcon size={24} className="mb-1" />
                      <span className="text-xs">Upload Logo</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                >
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {editingItem ? "Update Item" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entertainment;
