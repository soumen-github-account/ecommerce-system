import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getSellers = async () => {
  const { data } = await api.get("/sellers");

  return data.data;
};