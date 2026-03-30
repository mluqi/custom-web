import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const CardLayanan = ({
  image,
  title,
  speed,
  price,
  originalPrice,
  discount,
  discountNote,
  isHighlighted,
  contactPhone = "62811578511",
  waMessageSubscribe,
  waMessageAsk,
}) => {
  const { t, language } = useLanguage();

  // Helper untuk memproses template pesan dinamis
  const getLocalizedTemplate = (data, fallbackKey) => {
    if (!data) return t(fallbackKey);

    let parsedData = data;
    // Coba parse jika data masih berupa string JSON
    if (typeof data === "string") {
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        return data; // Jika bukan JSON, kembalikan string aslinya
      }
    }

    if (typeof parsedData === "object" && parsedData !== null) {
      return (
        parsedData[language] || parsedData.id || parsedData.en || t(fallbackKey)
      );
    }

    return String(parsedData);
  };

  const messageSubscribe = getLocalizedTemplate(
    waMessageSubscribe,
    "cardLayanan.messageSubscribe",
  )
    .replace("{title}", title)
    .replace("{speed}", speed);

  const messageAsk = getLocalizedTemplate(
    waMessageAsk,
    "cardLayanan.messageAsk",
  )
    .replace("{title}", title)
    .replace("{speed}", speed);

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-101 ${
        isHighlighted ? "ring-4 ring-accent" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-28 sm:h-32 overflow-hidden">
        <img
          src={image}
          alt={title}
          width="256"
          height="128"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="bg-gray-100 p-4 sm:p-6">
        {/* Title & Speed */}
        <div className="text-center mb-3 sm:mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-accent font-semibold">{speed}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-3">
          <div className="flex items-baseline justify-center gap-1 flex-wrap">
            <span className="text-gray-600 text-sm sm:text-base">Rp</span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {price.toLocaleString("id-ID")}
            </span>
            <span className="text-gray-500 text-xs sm:text-sm">
              / {t("cardLayanan.month")}
            </span>
          </div>
          {originalPrice && (
            <div className="text-red-500 line-through text-xs mt-1">
              Rp {originalPrice.toLocaleString("id-ID")}
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {discount && (
          <div className="bg-cyan-100 text-black text-center py-2 rounded-lg mb-3 font-semibold text-sm">
            {discount}
          </div>
        )}

        {/* Note */}
        <p className="text-gray-500 text-xs text-center mb-4">{discountNote}</p>

        {/* Buttons */}
        <div className="space-y-2">
          <a
            href={`https://wa.me/${contactPhone}?text=${encodeURIComponent(messageSubscribe)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-gradient-to-r from-secondary to-accent text-sm text-white font-semibold py-3 rounded-full transition-colors cursor-pointer hover:brightness-90"
          >
            {t("cardLayanan.subscribe")}
          </a>
          <a
            href={`https://wa.me/${contactPhone}?text=${encodeURIComponent(messageAsk)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-full border-2 border-gray-200 transition-colors cursor-pointer hover:text-gray-900 hover:border-gray-400"
          >
            {t("cardLayanan.chatSales")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardLayanan;
