import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Star,
  Languages,
} from "lucide-react";
import api from "../../services/api";

const BlogManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("id"); // 'id', 'en', 'cn'

  const initialFormState = {
    title: { id: "", en: "", cn: "" },
    content: { id: "", en: "", cn: "" },
    excerpt: { id: "", en: "", cn: "" },
    author: "Admin",
    category: "",
    tags: "",
    read_time: "5 min",
    is_featured: false,
    is_published: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const quillRef = useRef(null);

  // Fetch Articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/blog`, {
        params: { page, limit: 10, search: searchTerm },
      });
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, searchTerm]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["title", "excerpt"].includes(name)) {
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

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content: { ...prev.content, [activeTab]: content },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setCurrentArticle(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (article) => {
    setCurrentArticle(article);
    setFormData({
      title: article.title || { id: "", en: "", cn: "" },
      content: article.content || { id: "", en: "", cn: "" },
      excerpt: article.excerpt || { id: "", en: "", cn: "" },
      author: article.author || "",
      category: article.category || "",
      tags: Array.isArray(article.tags)
        ? article.tags.join(", ")
        : article.tags || "",
      read_time: article.read_time || "",
      is_featured: article.is_featured,
      is_published: article.is_published,
    });
    setImageFile(null);
    setImagePreview(
      article.image ? `${baseUrl}/uploads/${article.image}` : null,
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (["title", "content", "excerpt"].includes(key)) {
        data.append(key, JSON.stringify(formData[key]));
      } else if (key === "tags") {
        // Convert comma separated string to JSON array string
        const tagsArray = formData[key]
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
        data.append(key, JSON.stringify(tagsArray));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (currentArticle) {
        await api.put(`/blog/${currentArticle.id}`, data);
      } else {
        await api.post("/blog", data);
      }
      await fetchArticles();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Gagal menyimpan artikel.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentArticle) return;
    setActionLoading(true);
    try {
      await api.delete(`/blog/${currentArticle.id}`);
      await fetchArticles();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Gagal menghapus artikel.");
    } finally {
      setActionLoading(false);
    }
  };

  // Custom Image Handler for Quill
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const res = await api.post("/blog/upload-image", formData);
          const url = res.data.url;

          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", url);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Gagal mengupload gambar ke konten.");
        }
      }
    };
  }, []);

  // Quill Modules
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler],
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Artikel
          </h1>
          <p className="text-gray-500">Kelola postingan blog dan berita</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Buat Artikel
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Judul</th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Kategori
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Tanggal
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada artikel ditemukan.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className="font-medium text-gray-900 line-clamp-1"
                        title={article.title?.id}
                      >
                        {article.title?.id || article.title?.en || "No Title"}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        {article.is_featured && (
                          <Star
                            size={12}
                            className="text-yellow-500 fill-yellow-500"
                          />
                        )}
                        {article.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {article.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {article.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(article.published_at).toLocaleDateString(
                        "id-ID",
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(article)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentArticle(article);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm text-gray-600 hover:text-teal-600 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-gray-600">
            Halaman {page} dari {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-gray-600 hover:text-teal-600 disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {currentArticle ? "Edit Artikel" : "Buat Artikel Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <form
                id="articleForm"
                onSubmit={handleSubmit}
                className="space-y-6"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column (Main Content) */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Judul Artikel ({activeTab.toUpperCase()})
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
                        Konten ({activeTab.toUpperCase()})
                      </label>
                      <div className="h-64 mb-12">
                        <ReactQuill
                          ref={quillRef}
                          key={activeTab}
                          theme="snow"
                          value={formData.content[activeTab] || ""}
                          onChange={handleContentChange}
                          modules={modules}
                          className="h-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ringkasan (Excerpt) ({activeTab.toUpperCase()})
                      </label>
                      <textarea
                        name="excerpt"
                        value={formData.excerpt[activeTab] || ""}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      ></textarea>
                    </div>
                  </div>

                  {/* Right Column (Meta & Settings) */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar Utama
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors relative bg-gray-50">
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
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="py-8 text-gray-400 flex flex-col items-center">
                            <ImageIcon size={32} className="mb-2" />
                            <span className="text-xs">Upload Gambar</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (Pisahkan dengan koma)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="Tech, Internet, Tips"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Penulis
                        </label>
                        <input
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Waktu Baca
                        </label>
                        <input
                          type="text"
                          name="read_time"
                          value={formData.read_time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_published"
                          checked={formData.is_published}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">
                          Publikasikan
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_featured"
                          checked={formData.is_featured}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">
                          Featured Post (Unggulan)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="articleForm"
                disabled={actionLoading}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
              >
                {actionLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Simpan Artikel
              </button>
            </div>
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
                Hapus Artikel?
              </h3>
              <p className="text-gray-600 mb-6">
                Tindakan ini akan menghapus artikel{" "}
                <strong>{currentArticle?.title}</strong> secara permanen.
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

export default BlogManagement;
