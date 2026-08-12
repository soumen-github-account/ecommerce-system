import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getSubCategories,
  getLevel2Categories,
} from "../services/categoryApi.js";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });

export const useSubCategories = (categoryId) =>
  useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => getSubCategories(categoryId),
    enabled: !!categoryId,
  });

export const useLevel2Categories = (subCategoryId) =>
  useQuery({
    queryKey: ["level2", subCategoryId],
    queryFn: () => getLevel2Categories(subCategoryId),
    enabled: !!subCategoryId,
  });