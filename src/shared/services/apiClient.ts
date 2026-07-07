import axios from "axios";

const API_BASE_URL = "https://mock.api.local";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message ?? "Erro inesperado ao comunicar com o servidor.";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(new Error("Erro inesperado ao comunicar com o servidor."));
  },
);
