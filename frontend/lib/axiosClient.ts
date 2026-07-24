import axios from "axios";
import Cookies from "js-cookie";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: inject authorization token if stored locally or in cookies
axiosClient.interceptors.request.use(
  (config) => {
    let token: string | undefined = undefined;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || Cookies.get("token");
    } else {
      token = Cookies.get("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
