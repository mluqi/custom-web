import React from "react";
import { Wrench, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100">
        <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500">
          <Wrench size={48} className="animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Sedang Dalam Perbaikan
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Kami sedang melakukan pembaruan sistem untuk meningkatkan layanan kami.
          Mohon maaf atas ketidaknyamanan ini, silakan kembali lagi nanti.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 py-3 px-6 rounded-full">
            <Clock size={16} />
            <span>Estimasi selesai: Segera</span>
          </div>

          <Link
            to="/"
            className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center justify-center gap-1 mt-2"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
