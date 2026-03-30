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
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import api from "../../services/api";

const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("id"); // 'id', 'en', 'cn'

  const initialFormState = {
    name: "",
    position: { id: "", en: "", cn: "" },
    bio: { id: "", en: "", cn: "" },
    display_order: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/about/team");
      setMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["position", "bio"].includes(name)) {
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
    setCurrentMember(null);
    setFormData({
      ...initialFormState,
      display_order: members.length + 1,
    });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name || "",
      position: member.position || { id: "", en: "", cn: "" },
      bio: member.bio || { id: "", en: "", cn: "" },
      display_order: member.display_order || 0,
    });
    setImageFile(null);
    setImagePreview(
      member.image
        ? member.image.startsWith("http")
          ? member.image
          : `${baseUrl}/uploads/${member.image}`
        : null
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", JSON.stringify(formData.position));
    data.append("bio", JSON.stringify(formData.bio));
    data.append("display_order", formData.display_order);

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (currentMember) {
        await api.put(`/about/team/${currentMember.id}`, data);
      } else {
        await api.post("/about/team", data);
      }
      await fetchMembers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving team member:", error);
      alert("Gagal menyimpan data anggota tim.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentMember) return;
    setActionLoading(true);
    try {
      await api.delete(`/about/team/${currentMember.id}`);
      await fetchMembers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting team member:", error);
      alert("Gagal menghapus anggota tim.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Tim</h1>
          <p className="text-gray-500">Kelola daftar anggota tim dan struktur organisasi</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tambah Anggota
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : members.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            Belum ada anggota tim yang ditambahkan.
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-64 bg-gray-100">
                <img
                  src={
                    member.image
                      ? member.image.startsWith("http")
                        ? member.image
                        : `/uploads/${member.image}`
                      : "https://placehold.co/400x400?text=No+Image"
                  }
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-600 shadow-sm">
                  Urutan: {member.display_order}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                <p className="text-teal-600 font-medium text-sm mb-3">
                  {member.position?.id || member.position?.en || "-"}
                </p>
                <p className="text-gray-500 text-xs line-clamp-3 mb-4 flex-1">
                  {member.bio?.id || member.bio?.en || "Tidak ada bio."}
                </p>
                
                <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentMember(member);
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {currentMember ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posisi / Jabatan ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position[activeTab] || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
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
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto Profil
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50 h-48 flex items-center justify-center">
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
                          <ImageIcon size={32} className="mb-2" />
                          <span className="text-xs">Upload Foto</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografi Singkat ({activeTab.toUpperCase()})
                </label>
                <textarea
                  name="bio"
                  value={formData.bio[activeTab] || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                ></textarea>
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
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Anggota?</h3>
              <p className="text-gray-600 mb-6">
                Tindakan ini akan menghapus data anggota tim ini secara permanen.
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
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
