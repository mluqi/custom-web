import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, ChevronDown, Loader2 } from "lucide-react";
import JobCard from "../../../components/common/JobCard";
import { motion } from "framer-motion";
import api from "../../../services/api";
import SEO from "../../../components/common/SEO";
import { useLanguage } from "../../../contexts/LanguageContext";

const Career = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [locations, setLocations] = useState(["Semua Lokasi"]);
  const [departments, setDepartments] = useState(["Semua Departemen"]);

  // Fetch Filters (Locations & Departments)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await api.get("/career/filters");
        setLocations(["Semua Lokasi", ...response.data.locations]);
        setDepartments(["Semua Departemen", ...response.data.departments]);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };
    fetchFilters();
  }, []);

  // Reset halaman ke 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, selectedDepartment]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: 6 };
        if (searchQuery) params.search = searchQuery;

        if (selectedLocation !== "all") params.location = selectedLocation;
        if (selectedDepartment !== "all")
          params.department = selectedDepartment;

        const response = await api.get("/career", { params });
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedLocation, selectedDepartment, currentPage]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 md:pt-36 pt-32">
      <SEO
        title="Karir | Nat Waipi"
        description="Temukan peluang karir yang sesuai dengan passion dan skill Anda di NAT Networks."
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Bergabung Bersama Kami
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Temukan peluang karir yang sesuai dengan passion dan skill Anda.
            Mari berkembang bersama NAT Networks!
          </p>
        </motion.div>

        {/* Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari posisi atau keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="md:col-span-3">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer bg-white"
                >
                  {locations.map((loc, index) => (
                    <option key={index} value={index === 0 ? "all" : loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer bg-white"
                >
                  {departments.map((dept, index) => (
                    <option key={index} value={index === 0 ? "all" : dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-1">
              <button className="w-full bg-accent hover:brightness-90 text-white py-3 rounded-full transition-colors font-semibold">
                Cari
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Menampilkan{" "}
            <span className="font-semibold text-gray-900">{jobs.length}</span>{" "}
            lowongan pekerjaan
          </p>
        </motion.div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <JobCard {...job} />
              </motion.div>
            ))}
            {jobs.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                Tidak ada lowongan yang ditemukan.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center gap-3 mt-8"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-600 hover:border-accent hover:text-accent transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>

            <div className="flex gap-2">
              {/* Simple pagination logic: show all pages if total is small, or just current range */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic sederhana untuk menampilkan halaman di sekitar current page
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === pageNum
                        ? "bg-gray-900 text-white"
                        : "border-2 border-gray-300 text-gray-600 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-600 hover:border-accent hover:text-accent transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Export both components
export default Career;
