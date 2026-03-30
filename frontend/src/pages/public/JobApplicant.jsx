import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";
import api from "../../services/api";

const JobApplicant = () => {
  const [searchParams] = useSearchParams();
  const positionFromUrl = searchParams.get("position") || "";
  const jobIdFromUrl = searchParams.get("jobId") || "";

  const [formData, setFormData] = useState({
    namaLengkap: "",
    usia: "",
    pendidikanTerakhir: "",
    jurusan: "",
    sekolahUniversitas: "",
    nilai_akhir_ipk: "",
    domisili: "",
    email: "",
    noHp: "",
    posisi: positionFromUrl,
    jobId: jobIdFromUrl,
    statusSaatIni: "",
    pengalamanRelevan: "Tidak",
    posisiPengalaman: "",
    bersediaDitempatkan: "Ya",
    cv: null,
    portofolio: null,
    instagram: "",
    linkedin: "",
    tiktok: "",
    pelatihan: [], // Array untuk data pelatihan dinamis
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      posisi: positionFromUrl || prev.posisi,
      jobId: jobIdFromUrl || prev.jobId,
    }));
  }, [positionFromUrl, jobIdFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Handler untuk Dynamic Form Pelatihan
  const handleAddPelatihan = () => {
    setFormData((prev) => ({
      ...prev,
      pelatihan: [
        ...prev.pelatihan,
        { name: "", organization: "", date: "", expired: "", credentialId: "" },
      ],
    }));
  };

  const handleRemovePelatihan = (index) => {
    setFormData((prev) => ({
      ...prev,
      pelatihan: prev.pelatihan.filter((_, i) => i !== index),
    }));
  };

  const handlePelatihanChange = (index, field, value) => {
    const newPelatihan = [...formData.pelatihan];
    newPelatihan[index][field] = value;
    setFormData((prev) => ({ ...prev, pelatihan: newPelatihan }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const dataToSend = new FormData();
      dataToSend.append("timestamp", new Date().toLocaleString());

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        if (key !== "cv" && key !== "portofolio" && key !== "pelatihan") {
          dataToSend.append(key, formData[key]);
        }
      });

      // Process Pelatihan Array to JSON Strings (sesuai model backend)
      const pNames = formData.pelatihan.map((p) => p.name);
      const pOrgs = formData.pelatihan.map((p) => p.organization);
      const pDates = formData.pelatihan.map((p) => p.date);
      const pExpired = formData.pelatihan.map((p) => p.expired);
      const pCreds = formData.pelatihan.map((p) => p.credentialId);

      dataToSend.append("pelatihan_name", JSON.stringify(pNames));
      dataToSend.append("pelatihan_orgaisasi", JSON.stringify(pOrgs)); // Sesuai nama kolom di backend
      dataToSend.append("pelatihan_date", JSON.stringify(pDates));
      dataToSend.append("pelatihan_expired", JSON.stringify(pExpired));
      dataToSend.append("pelatihan_id_credentials", JSON.stringify(pCreds));

      // Append files
      if (formData.cv) dataToSend.append("cv", formData.cv);
      if (formData.portofolio)
        dataToSend.append("portofolio", formData.portofolio);

      await api.post("/career/apply", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error submitting form:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Maaf, terjadi kesalahan saat mengirim lamaran. Silakan coba lagi nanti.",
        );
      }
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-20">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Lamaran Terkirim!
          </h2>
          <p className="text-gray-600 mb-8">
            Terima kasih telah melamar. Data Anda telah kami terima dan akan
            segera kami proses. Tim HR kami akan menghubungi Anda jika
            kualifikasi sesuai.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/career"
              className="bg-accent text-white px-8 py-3 rounded-full font-semibold hover:brightness-90 transition-colors"
            >
              Kembali ke Karir
            </Link>
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-32 pt-32 md:pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Formulir Lamaran Kerja
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Silakan lengkapi formulir di bawah ini dengan data yang valid.
            Pastikan CV dan Portofolio yang Anda unggah adalah versi terbaru.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            {/* Data Pribadi */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-accent rounded-full"></div>
                Data Pribadi
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    required
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Usia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="usia"
                    required
                    value={formData.usia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Contoh: 25"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="nama@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    No. HP (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="noHp"
                    required
                    value={formData.noHp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="081234567890"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Domisili / Alamat Lengkap{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="domisili"
                    required
                    value={formData.domisili}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                    placeholder="Masukkan alamat lengkap domisili saat ini"
                  ></textarea>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Pendidikan */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-accent rounded-full"></div>
                Pendidikan
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pendidikan Terakhir <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="pendidikanTerakhir"
                    required
                    value={formData.pendidikanTerakhir}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white"
                  >
                    <option value="">Pilih Pendidikan</option>
                    <option value="SMA/SMK">SMA / SMK</option>
                    <option value="D3">D3</option>
                    <option value="D4/S1">D4 / S1</option>
                    <option value="S2">S2</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-medium text-gray-700">
                    Jurusan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jurusan"
                    required
                    value={formData.jurusan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Contoh: Teknik Informatika"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sekolah / Universitas{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sekolahUniversitas"
                    required
                    value={formData.sekolahUniversitas}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Nama Sekolah atau Universitas"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nilai Akhir / IPK
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="nilai_akhir_ipk"
                    value={formData.nilai_akhir_ipk}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Contoh: 3.50"
                  />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Media Sosial */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-accent rounded-full"></div>
                Media Sosial
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Link Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Link LinkedIn
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Link TikTok
                  </label>
                  <input
                    type="text"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="https://tiktok.com/@username"
                  />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Pelatihan & Sertifikasi */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-accent rounded-full"></div>
                  Pelatihan & Sertifikasi
                </h3>
                <button
                  type="button"
                  onClick={handleAddPelatihan}
                  className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 bg-accent/5 hover:bg-accent/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              </div>

              <div className="space-y-4">
                {formData.pelatihan.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemovePelatihan(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="grid md:grid-cols-2 gap-4 pr-8">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">
                          Nama Pelatihan / Sertifikasi
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handlePelatihanChange(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-accent outline-none text-sm"
                          placeholder="Contoh: Web Development Bootcamp"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">
                          Penyelenggara / Organisasi
                        </label>
                        <input
                          type="text"
                          value={item.organization}
                          onChange={(e) =>
                            handlePelatihanChange(
                              index,
                              "organization",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-accent outline-none text-sm"
                          placeholder="Contoh: Dicoding Indonesia"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">
                          Tanggal Pelaksanaan
                        </label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) =>
                            handlePelatihanChange(index, "date", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-accent outline-none text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">
                          Berlaku Hingga (Opsional)
                        </label>
                        <input
                          type="date"
                          value={item.expired}
                          onChange={(e) =>
                            handlePelatihanChange(
                              index,
                              "expired",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-accent outline-none text-sm"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-medium text-gray-600">
                          ID Kredensial (Opsional)
                        </label>
                        <input
                          type="text"
                          value={item.credentialId}
                          onChange={(e) =>
                            handlePelatihanChange(
                              index,
                              "credentialId",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-accent outline-none text-sm"
                          placeholder="Contoh: ABCD-1234-EFGH"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {formData.pelatihan.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 text-sm">
                    Belum ada data pelatihan yang ditambahkan.
                  </div>
                )}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Posisi & Pengalaman */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-accent rounded-full"></div>
                Posisi & Pengalaman
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Posisi yang Dilamar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="posisi"
                    required
                    value={formData.posisi}
                    onChange={handleChange}
                    disabled={!!jobIdFromUrl}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    placeholder="Contoh: Staff Administrasi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status Saat Ini <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="statusSaatIni"
                    required
                    value={formData.statusSaatIni}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white"
                  >
                    <option value="">Pilih Status</option>
                    <option value="Bekerja">Sedang Bekerja</option>
                    <option value="Tidak Bekerja">Tidak Bekerja</option>
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Memiliki Pengalaman Relevan?
                  </label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pengalamanRelevan"
                        value="Ya"
                        checked={formData.pengalamanRelevan === "Ya"}
                        onChange={handleChange}
                        className="w-4 h-4 text-accent focus:ring-accent"
                      />
                      <span>Ya</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pengalamanRelevan"
                        value="Tidak"
                        checked={formData.pengalamanRelevan === "Tidak"}
                        onChange={handleChange}
                        className="w-4 h-4 text-accent focus:ring-accent"
                      />
                      <span>Tidak</span>
                    </label>
                  </div>
                </div>

                {formData.pengalamanRelevan === "Ya" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Posisi Pengalaman Relevan
                    </label>
                    <input
                      type="text"
                      name="posisiPengalaman"
                      value={formData.posisiPengalaman}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      placeholder="Sebutkan posisi pengalaman Anda"
                    />
                  </div>
                )}

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Bersedia Ditempatkan Sesuai Kebutuhan Perusahaan?
                  </label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="bersediaDitempatkan"
                        value="Ya"
                        checked={formData.bersediaDitempatkan === "Ya"}
                        onChange={handleChange}
                        className="w-4 h-4 text-accent focus:ring-accent"
                      />
                      <span>Ya, Bersedia</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="bersediaDitempatkan"
                        value="Tidak"
                        checked={formData.bersediaDitempatkan === "Tidak"}
                        onChange={handleChange}
                        className="w-4 h-4 text-accent focus:ring-accent"
                      />
                      <span>Tidak</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Upload Dokumen */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-accent rounded-full"></div>
                Upload Dokumen
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* CV Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Curriculum Vitae (CV){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        formData.cv
                          ? "border-accent bg-accent/5"
                          : "border-gray-300 hover:border-accent/50 hover:bg-gray-50"
                      }`}
                    >
                      {formData.cv ? (
                        <div className="flex flex-col items-center text-accent">
                          <FileText className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium text-center px-4 truncate max-w-full">
                            {formData.cv.name}
                          </span>
                          <span className="text-xs mt-1">Klik untuk ganti</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium">Upload CV</span>
                          <span className="text-xs mt-1">
                            PDF, DOC, DOCX (Max 5MB)
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Portfolio Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Portofolio
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="portofolio"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="portfolio-upload"
                    />
                    <label
                      htmlFor="portfolio-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        formData.portofolio
                          ? "border-accent bg-accent/5"
                          : "border-gray-300 hover:border-accent/50 hover:bg-gray-50"
                      }`}
                    >
                      {formData.portofolio ? (
                        <div className="flex flex-col items-center text-accent">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium text-center px-4 truncate max-w-full">
                            {formData.portofolio.name}
                          </span>
                          <span className="text-xs mt-1">Klik untuk ganti</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium">
                            Upload Portofolio
                          </span>
                          <span className="text-xs mt-1">
                            PDF, JPG, PNG (Max 10MB)
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Error Message */}
            {submitStatus === "error" && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-secondary to-accent text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengirim Lamaran...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Lamaran
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default JobApplicant;
