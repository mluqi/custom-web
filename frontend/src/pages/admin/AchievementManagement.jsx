import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Languages,
  Trophy,
  Award,
  Star,
  TrendingUp,
  MapPin,
  Flag,
  Rocket,
  Building2,
  Calendar,
  Users,
  Settings,
} from "lucide-react";
import api from "../../services/api";

const AchievementManagement = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("id"); // 'id', 'en', 'cn'

  // Stats Management State
  const [stats, setStats] = useState([]);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const initialFormState = {
    year: "",
    title: { id: "", en: "", cn: "" },
    description: { id: "", en: "", cn: "" },
    issuer: { id: "", en: "", cn: "" }, // Label/Kategori
    icon: "Trophy",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Icon Options for Selection
  const iconOptions = [
    { name: "Trophy", component: <Trophy size={24} /> },
    { name: "Award", component: <Award size={24} /> },
    { name: "Star", component: <Star size={24} /> },
    { name: "TrendingUp", component: <TrendingUp size={24} /> },
    { name: "MapPin", component: <MapPin size={24} /> },
    { name: "Flag", component: <Flag size={24} /> },
    { name: "Rocket", component: <Rocket size={24} /> },
    { name: "Building2", component: <Building2 size={24} /> },
    { name: "Calendar", component: <Calendar size={24} /> },
    { name: "Users", component: <Users size={24} /> },
  ];

  // Helper to render icon dynamically
  const renderIcon = (iconName, size = 20) => {
    const IconComponent = iconOptions.find(
      (opt) => opt.name === iconName,
    )?.component;
    if (IconComponent) {
      return React.cloneElement(IconComponent, { size });
    }
    return <Trophy size={size} />;
  };

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await api.get("/achievement");
      setAchievements(response.data);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/settings");
      const statsSetting = response.data.find(
        (s) => s.key === "achievement_stats",
      );
      if (statsSetting) {
        try {
          setStats(JSON.parse(statsSetting.value));
        } catch (e) {
          setStats([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchAchievements();
    fetchStats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["title", "description", "issuer"].includes(name)) {
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

  const openCreateModal = () => {
    setCurrentAchievement(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (achievement) => {
    setCurrentAchievement(achievement);
    setFormData({
      year: achievement.year || "",
      title: achievement.title || { id: "", en: "", cn: "" },
      description: achievement.description || { id: "", en: "", cn: "" },
      issuer: achievement.issuer || { id: "", en: "", cn: "" },
      icon: achievement.icon || "Trophy",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (currentAchievement) {
        await api.put(`/achievement/${currentAchievement.id}`, formData);
      } else {
        await api.post("/achievement", formData);
      }
      await fetchAchievements();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving achievement:", error);
      alert("Gagal menyimpan data.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentAchievement) return;
    setActionLoading(true);
    try {
      await api.delete(`/achievement/${currentAchievement.id}`);
      await fetchAchievements();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting achievement:", error);
      alert("Gagal menghapus data.");
    } finally {
      setActionLoading(false);
    }
  };

  // Stats Handlers
  const handleStatChange = (index, field, value, lang = null) => {
    const newStats = [...stats];
    if (lang) {
      newStats[index][field] = { ...newStats[index][field], [lang]: value };
    } else {
      newStats[index][field] = value;
    }
    setStats(newStats);
  };

  const handleStatsSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("achievement_stats", JSON.stringify(stats));

      await api.put("/settings", formData);
      setIsStatsModalOpen(false);
      alert("Statistik berhasil disimpan!");
      // Refresh stats to ensure sync
      fetchStats();
    } catch (error) {
      console.error("Error saving stats:", error);
      alert("Gagal menyimpan statistik.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Sejarah & Prestasi
          </h1>
          <p className="text-gray-500">
            Kelola timeline sejarah dan pencapaian perusahaan
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Settings size={20} />
            Edit Statistik
          </button>
          <button
            onClick={openCreateModal}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Tambah Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : achievements.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            Belum ada data sejarah/prestasi yang ditambahkan.
          </div>
        ) : (
          achievements.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                      {renderIcon(item.icon)}
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentAchievement(item);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {item.title?.id || item.title?.en || "No Title"}
                </h3>
                <p className="text-sm text-teal-600 font-medium mb-3">
                  {item.issuer?.id || item.issuer?.en || "-"}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {item.description?.id ||
                    item.description?.en ||
                    "No Description"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {currentAchievement ? "Edit Data" : "Tambah Data Baru"}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahun
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="Contoh: 2023"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label / Kategori ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      name="issuer"
                      value={formData.issuer[activeTab] || ""}
                      onChange={handleInputChange}
                      placeholder="Contoh: Expansion, Milestone"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Ikon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((opt) => (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, icon: opt.name })
                        }
                        className={`p-2 rounded-lg flex items-center justify-center border transition-all ${
                          formData.icon === opt.name
                            ? "bg-teal-50 border-teal-500 text-teal-600"
                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                        title={opt.name}
                      >
                        {opt.component}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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

      {/* Stats Edit Modal */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                Edit Statistik Pencapaian
              </h3>
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleStatsSubmit}
              className="p-6 space-y-6 overflow-y-auto"
            >
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
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Label ({activeTab.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={stat.label[activeTab] || ""}
                          onChange={(e) =>
                            handleStatChange(
                              index,
                              "label",
                              e.target.value,
                              activeTab,
                            )
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Value
                        </label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) =>
                            handleStatChange(index, "value", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Icon (Lucide Name)
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-gray-200 text-teal-600">
                            {renderIcon(stat.icon, 16)}
                          </div>
                          <select
                            value={stat.icon}
                            onChange={(e) =>
                              handleStatChange(index, "icon", e.target.value)
                            }
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                          >
                            {iconOptions.map((opt) => (
                              <option key={opt.name} value={opt.name}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsStatsModalOpen(false)}
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
                  Simpan Perubahan
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
                Hapus Data?
              </h3>
              <p className="text-gray-600 mb-6">
                Tindakan ini akan menghapus data ini secara permanen.
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

export default AchievementManagement;
