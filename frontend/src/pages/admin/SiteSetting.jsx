import React, { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Languages,
  MapPin,
  Rocket,
  ShieldCheck,
  Zap,
  Wifi,
  Heart,
  Users,
} from "lucide-react";
import api from "../../services/api";
import assets from "../../assets/assets";
import { useSearchParams } from "react-router-dom";

const PAGE_HEADER_GROUPS = [
  "achievement_page",
  "activity_page",
  "career_page",
  "promo_page",
  "blog_page",
];

const SiteSetting = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGroup = searchParams.get("group") || "";
  const [previews, setPreviews] = useState({});
  const [fileInputs, setFileInputs] = useState({});
  const [activeTab, setActiveTab] = useState("id"); // 'id', 'en', 'cn'

  // Opsi ikon untuk editor fitur hero (aset gambar & react-icons).
  const heroIconOptions = [
    // Dari aset gambar
    {
      key: "fiberIcon",
      node: <img src={assets.fiberIcon} alt="Fiber" />,
      name: "Fiber",
    },
    {
      key: "fupIcon",
      node: <img src={assets.fupIcon} alt="FUP" />,
      name: "FUP",
    },
    {
      key: "modemIcon",
      node: <img src={assets.modemIcon} alt="Modem" />,
      name: "Modem",
    },
    {
      key: "stabilIcon",
      node: <img src={assets.stabilIcon} alt="Stabil" />,
      name: "Stabil",
    },
    // Dari react-icons (Lucide)
    { key: "lucide-rocket", node: <Rocket />, name: "Rocket" },
    { key: "lucide-shield-check", node: <ShieldCheck />, name: "Shield" },
    { key: "lucide-zap", node: <Zap />, name: "Fast" },
    { key: "lucide-wifi", node: <Wifi />, name: "Wifi" },
    { key: "lucide-heart", node: <Heart />, name: "Love" },
    { key: "lucide-users", node: <Users />, name: "Users" },
  ];

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Pastikan endpoint ini sesuai dengan route backend Anda (misal: /settings)
      const response = await api.get("/settings");

      // Parse value untuk field i18n
      const processedSettings = response.data
        .filter((s) => s.key !== "achievement_stats")
        .map((s) => {
          if (s.type.endsWith("_i18n")) {
            try {
              const parsed = JSON.parse(s.value);
              return {
                ...s,
                value:
                  parsed && typeof parsed === "object"
                    ? parsed
                    : { id: "", en: "", cn: "" },
              };
            } catch {
              return { ...s, value: { id: s.value || "", en: "", cn: "" } };
            }
          }
          return s;
        });
      setSettings(processedSettings);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value, lang = null) => {
    setSettings((prev) =>
      prev.map((s) => {
        if (s.key !== key) return s;
        // Jika field i18n, update key bahasa spesifik
        if (s.type.endsWith("_i18n") && lang) {
          return { ...s, value: { ...s.value, [lang]: value } };
        }
        return { ...s, value };
      }),
    );
  };

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInputs((prev) => ({ ...prev, [key]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [key]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();

    // Append semua setting tipe text/color/textarea
    settings.forEach((s) => {
      if (s.type !== "image") {
        let valueToSend = s.value;
        if (s.type.endsWith("_i18n")) {
          valueToSend = JSON.stringify(s.value);
        }
        formData.append(s.key, valueToSend || "");
      }
    });

    // Append file yang baru dipilih
    Object.keys(fileInputs).forEach((key) => {
      formData.append(key, fileInputs[key]);
    });

    try {
      await api.put("/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Pengaturan berhasil disimpan!");
      // Refresh data untuk memastikan sinkronisasi (terutama nama file gambar baru)
      await fetchSettings();
      setFileInputs({});
      setPreviews({});
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  // Mengelompokkan settings berdasarkan 'group'
  // Menggunakan Set untuk mendapatkan list grup unik
  const rawGroups = [...new Set(settings.map((s) => s.group))];

  // Filter out page header groups and add a single 'page_headers' entry if any exist
  const groups = rawGroups.filter((g) => !PAGE_HEADER_GROUPS.includes(g));
  if (rawGroups.some((g) => PAGE_HEADER_GROUPS.includes(g))) {
    groups.push("page_headers");
  }

  // Set default group if none selected
  useEffect(() => {
    if (!activeGroup && groups.length > 0) {
      setSearchParams({ group: groups[0] }, { replace: true });
    }
  }, [activeGroup, groups, setSearchParams]);

  // Filter settings yang akan ditampilkan berdasarkan tab grup yang aktif
  const filteredSettings = settings.filter((s) => {
    if (activeGroup === "page_headers") {
      return PAGE_HEADER_GROUPS.includes(s.group);
    }
    return s.group === activeGroup;
  });

  // Helper untuk merender editor link footer (JSON List)
  const renderFooterLinksEditor = (setting) => {
    let links = [];
    try {
      links = setting.value ? JSON.parse(setting.value) : [];
      if (!Array.isArray(links)) links = [];
      // Normalisasi data lama (string) ke format baru (object i18n)
      links = links.map((link) => ({
        ...link,
        label:
          typeof link.label === "object"
            ? link.label
            : {
                id: link.label || "",
                en: link.label || "",
                cn: link.label || "",
              },
      }));
    } catch (e) {
      links = [];
    }

    const updateLinks = (newLinks) => {
      handleInputChange(setting.key, JSON.stringify(newLinks));
    };

    return (
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
        {links.map((link, idx) => (
          <div key={idx} className="flex gap-3 items-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <div>
                <input
                  type="text"
                  value={link.label[activeTab] || ""}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx] = {
                      ...link,
                      label: { ...link.label, [activeTab]: e.target.value },
                    };
                    updateLinks(newLinks);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-500"
                  placeholder={`Label (${activeTab.toUpperCase()})`}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={link.href || ""}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx] = { ...link, href: e.target.value };
                    updateLinks(newLinks);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-500"
                  placeholder="URL (mis: /services)"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const newLinks = links.filter((_, i) => i !== idx);
                updateLinks(newLinks);
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors mt-0.5"
              title="Hapus Link"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            updateLinks([
              ...links,
              { label: { id: "", en: "", cn: "" }, href: "" },
            ])
          }
          className="flex items-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-700 mt-2"
        >
          <Plus size={16} /> Tambah Link Baru
        </button>
      </div>
    );
  };

  // Helper untuk merender editor lokasi (Map List)
  const renderLocationEditor = (setting) => {
    let locations = [];
    try {
      locations = setting.value ? JSON.parse(setting.value) : [];
      if (!Array.isArray(locations)) locations = [];
      // Normalisasi data
      locations = locations.map((loc) => ({
        ...loc,
        title:
          typeof loc.title === "object"
            ? loc.title
            : { id: loc.title || "", en: loc.title || "", cn: loc.title || "" },
        address:
          typeof loc.address === "object"
            ? loc.address
            : {
                id: loc.address || "",
                en: loc.address || "",
                cn: loc.address || "",
              },
      }));
    } catch (e) {
      locations = [];
    }

    const updateLocations = (newLocations) => {
      handleInputChange(setting.key, JSON.stringify(newLocations));
    };

    return (
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        {locations.map((loc, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative"
          >
            <button
              type="button"
              onClick={() => {
                const newLocations = locations.filter((_, i) => i !== idx);
                updateLocations(newLocations);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Hapus Lokasi"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Nama Lokasi ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={loc.title[activeTab] || ""}
                  onChange={(e) => {
                    const newLocations = [...locations];
                    newLocations[idx] = {
                      ...loc,
                      title: { ...loc.title, [activeTab]: e.target.value },
                    };
                    updateLocations(newLocations);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Alamat ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={loc.address[activeTab] || ""}
                  onChange={(e) => {
                    const newLocations = [...locations];
                    newLocations[idx] = {
                      ...loc,
                      address: { ...loc.address, [activeTab]: e.target.value },
                    };
                    updateLocations(newLocations);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Google Maps Embed URL (src)
                </label>
                <input
                  type="text"
                  value={loc.mapUrl || ""}
                  onChange={(e) => {
                    const newLocations = [...locations];
                    newLocations[idx] = { ...loc, mapUrl: e.target.value };
                    updateLocations(newLocations);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-500 font-mono text-xs"
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            updateLocations([
              ...locations,
              {
                title: { id: "", en: "", cn: "" },
                address: { id: "", en: "", cn: "" },
                mapUrl: "",
              },
            ])
          }
          className="flex items-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-700 mt-2"
        >
          <Plus size={16} /> Tambah Lokasi Baru
        </button>
      </div>
    );
  };

  // Helper untuk merender editor fitur (Feature List)
  const renderFeatureListEditor = (setting) => {
    let features = [];
    try {
      features = setting.value ? JSON.parse(setting.value) : [];
      if (!Array.isArray(features)) features = [];
      // Normalisasi data
      features = features.map((feat) => ({
        ...feat,
        icon: feat.icon || "",
        subtitle:
          typeof feat.subtitle === "object"
            ? feat.subtitle
            : {
                id: feat.subtitle || "",
                en: feat.subtitle || "",
                cn: feat.subtitle || "",
              },
        title:
          typeof feat.title === "object"
            ? feat.title
            : {
                id: feat.title || "",
                en: feat.title || "",
                cn: feat.title || "",
              },
        description:
          typeof feat.description === "object"
            ? feat.description
            : {
                id: feat.description || "",
                en: feat.description || "",
                cn: feat.description || "",
              },
      }));
    } catch (e) {
      features = [];
    }

    const updateFeatures = (newFeatures) => {
      handleInputChange(setting.key, JSON.stringify(newFeatures));
    };

    const isHeroFeatures = setting.key === "hero_features";
    const isFixed = setting.group === "landingcontent";

    return (
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative"
          >
            {!isFixed && (
              <button
                type="button"
                onClick={() => {
                  const newFeatures = features.filter((_, i) => i !== idx);
                  updateFeatures(newFeatures);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Hapus Fitur"
              >
                <Trash2 size={18} />
              </button>
            )}

            <div className="grid grid-cols-1 gap-3">
              {isHeroFeatures && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Ikon
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 bg-gray-100 rounded-lg">
                    {heroIconOptions.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          const newFeatures = [...features];
                          newFeatures[idx] = { ...feat, icon: opt.key };
                          updateFeatures(newFeatures);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                          feat.icon === opt.key
                            ? "border-teal-500 bg-teal-50"
                            : "border-transparent hover:bg-gray-200"
                        }`}
                        title={opt.name}
                      >
                        <div className="w-8 h-8 flex items-center justify-center text-gray-700">
                          {React.cloneElement(opt.node, {
                            className: "w-7 h-7 object-contain",
                          })}
                        </div>
                        <span className="text-[10px] mt-1 text-gray-600 truncate">
                          {opt.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Judul ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={feat.title[activeTab] || ""}
                  onChange={(e) => {
                    const newFeatures = [...features];
                    newFeatures[idx] = {
                      ...feat,
                      title: { ...feat.title, [activeTab]: e.target.value },
                    };
                    updateFeatures(newFeatures);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {isHeroFeatures ? "Subtitle" : "Deskripsi"} (
                  {activeTab.toUpperCase()})
                </label>
                <textarea
                  rows="2"
                  value={
                    (isHeroFeatures
                      ? feat.subtitle[activeTab]
                      : feat.description[activeTab]) || ""
                  }
                  onChange={(e) => {
                    const newFeatures = [...features];
                    const fieldKey = isHeroFeatures
                      ? "subtitle"
                      : "description";
                    newFeatures[idx] = {
                      ...feat,
                      [fieldKey]: {
                        ...feat[fieldKey],
                        [activeTab]: e.target.value,
                      },
                    };
                    updateFeatures(newFeatures);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        ))}
        {!isFixed && (
          <button
            type="button"
            onClick={() =>
              updateFeatures([
                ...features,
                {
                  title: { id: "", en: "", cn: "" },
                  description: { id: "", en: "", cn: "" },
                  subtitle: { id: "", en: "", cn: "" },
                },
              ])
            }
            className="flex items-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-700 mt-2"
          >
            <Plus size={16} /> Tambah Fitur Baru
          </button>
        )}
      </div>
    );
  };

  // Helper untuk merender item setting individual
  const renderSettingItem = (setting) => {
    return (
      <div
        key={setting.key}
        className="border-b border-gray-50 pb-6 last:border-0 last:pb-0"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
          {setting.key.replace(/_/g, " ")}
          {setting.type.endsWith("_i18n") && (
            <span className="ml-2 text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase">
              {activeTab}
            </span>
          )}
        </label>

        {/* Render Input Berdasarkan Group & Type */}
        {setting.group === "footer_links" ? (
          renderFooterLinksEditor(setting)
        ) : setting.type === "location_list" ? (
          renderLocationEditor(setting)
        ) : setting.type === "feature_list" ? (
          renderFeatureListEditor(setting)
        ) : setting.type === "text_i18n" ? (
          <input
            type="text"
            value={setting.value[activeTab] || ""}
            onChange={(e) =>
              handleInputChange(setting.key, e.target.value, activeTab)
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        ) : setting.type === "textarea_i18n" ? (
          <textarea
            rows="4"
            value={setting.value[activeTab] || ""}
            onChange={(e) =>
              handleInputChange(setting.key, e.target.value, activeTab)
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        ) : setting.type === "text" ? (
          <input
            type="text"
            value={setting.value || ""}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        ) : setting.type === "textarea" ? (
          <textarea
            rows="4"
            value={setting.value || ""}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        ) : setting.type === "color" ? (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={setting.value || "#000000"}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="h-10 w-20 cursor-pointer rounded border border-gray-300 p-1"
            />
            <input
              type="text"
              value={setting.value || ""}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 uppercase"
            />
          </div>
        ) : setting.type === "image" ? (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50 h-40 flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(setting.key, e)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previews[setting.key] ? (
                <img
                  src={previews[setting.key]}
                  alt="Preview"
                  className="h-full object-contain"
                />
              ) : setting.value ? (
                <img
                  src={
                    setting.value.startsWith("http")
                      ? setting.value
                      : `${baseUrl}/uploads/${setting.value}`
                  }
                  alt="Current"
                  className="h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-xs">Klik untuk upload gambar</span>
                </div>
              )}
            </div>
            {setting.value && !previews[setting.key] && (
              <p className="text-xs text-gray-500 truncate">
                File saat ini: {setting.value}
              </p>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  // Helper untuk merender grup Page Headers dengan Preview
  const renderPageHeadersGroup = () => {
    const pages = [
      { id: "achievement", title: "Achievement Page", dark: false },
      { id: "activity", title: "Activity Page", dark: false },
      { id: "career", title: "Career Page", dark: false },
      { id: "promo", title: "Promo Page", dark: true },
      { id: "blog", title: "Blog Page", dark: true },
    ];

    return (
      <div className="space-y-12">
        {pages.map((page) => {
          const pageSettings = filteredSettings.filter((s) =>
            s.key.startsWith(page.id),
          );
          if (pageSettings.length === 0) return null;

          const titleKey = `${page.id}_header_title`;
          const descKey = `${page.id}_header_desc`;

          const titleSetting = pageSettings.find((s) => s.key === titleKey);
          const descSetting = pageSettings.find((s) => s.key === descKey);

          const titleVal = titleSetting?.value?.[activeTab] || "";
          const descVal = descSetting?.value?.[activeTab] || "";

          return (
            <div
              key={page.id}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-gray-700 flex justify-between items-center">
                <span>{page.title}</span>
                <span className="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded border">
                  Preview Mode
                </span>
              </div>

              {/* Preview Section */}
              <div
                className={`p-12 text-center transition-colors duration-300 ${
                  page.dark
                    ? "bg-slate-900 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  {titleVal || (
                    <span className="opacity-30 italic">Judul Halaman</span>
                  )}
                </h1>
                <p
                  className={`text-lg max-w-2xl mx-auto leading-relaxed ${
                    page.dark ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  {descVal || (
                    <span className="opacity-30 italic">
                      Deskripsi halaman akan muncul di sini...
                    </span>
                  )}
                </p>
              </div>

              {/* Inputs Section */}
              <div className="p-6 bg-white border-t border-gray-200 space-y-6">
                {pageSettings.map((setting) => renderSettingItem(setting))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Pengaturan Website
          </h1>
          <p className="text-gray-500">
            Kelola konfigurasi global, tampilan, dan informasi kontak.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setSearchParams({ group })}
                className={`w-full text-left px-4 py-3 text-sm font-medium capitalize transition-colors border-l-4 ${
                  activeGroup === group
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                {group.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            {/* Language Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-4 mb-6">
              {["id", "en", "cn"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === lang
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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

            <div className="space-y-8">
              {activeGroup === "page_headers"
                ? renderPageHeadersGroup()
                : filteredSettings.map((setting) => renderSettingItem(setting))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white pb-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiteSetting;
