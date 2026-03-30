import axios, { InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: "https://dev4-p3.palindo.id/api",
  // baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Cek jika error adalah 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Pastikan error bukan berasal dari proses login (misal salah password) agar tidak refresh halaman
      if (!error.config.url?.includes("/auth/signin")) {
        alert("Sesi habis, silakan login kembali.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
