// src/api/axiosInstance.js
import axios from "axios";
import { config } from "../config"; // Make sure config.api_host is defined properly

const axiosInstance = axios.create({
  baseURL: config.api_host,
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Response interceptor to handle 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      window.location.href = "/login"; // ✅ Redirect to login page
      localStorage.removeItem("accessToken");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
