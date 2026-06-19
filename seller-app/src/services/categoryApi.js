import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getCategories = async () => {
  const { data } = await api.get("/api/category/categories");
  console.log("Categories:", data);
  return data.data;
};

export const getSubCategories = async (categoryId) => {
  const { data } = await api.get(`/api/category/categories/${categoryId}/subcategories`);
  return data.data;
};

export const getLevel2Categories = async (subCategoryId) => {
  const { data } = await api.get(
    `/api/category/subcategories/${subCategoryId}/level2`
  );
  return data.data;
};