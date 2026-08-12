import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getSellers = async () => {
  const { data } = await api.get("/api/v1/sellers/seller/me");

  return data.seller;
};

export const getAllSeller = async () => {
  const { data } = await api.get("/api/product/get-all-seller");

  return data.sellers;
};

export const logoutSeller = async () => {
  const { data } = await api.post("/api/seller/logout");
  return data;
};