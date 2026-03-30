import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <FileQuestion size={48} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau
          tidak pernah ada.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-teal-500/30 hover:scale-105"
        >
          <Home size={20} />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
