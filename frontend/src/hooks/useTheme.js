import { useEffect } from "react";
import api from "../services/api";

export const useTheme = () => {
  useEffect(() => {
    const fetchAndApplyColors = async () => {
      try {
        // Ambil setting public (tanpa auth)
        const response = await api.get("/settings/public");
        const settings = response.data;

        const root = document.documentElement;

        // Update CSS Variables jika data ada
        if (settings.accent_color) {
          root.style.setProperty("--color-accent", settings.accent_color);
        }
        if (settings.secondary_color) {
          root.style.setProperty("--color-secondary", settings.secondary_color);
        }
      } catch (error) {
        console.error("Failed to load theme settings:", error);
      }
    };

    fetchAndApplyColors();
  }, []);
};
