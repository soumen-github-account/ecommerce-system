
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getMyProducts = async () => {
    const response = await api.get(
        "/api/v1/sellers/product-edit/products"
    );

    return response.data;
};

export const getMyProductById = async (variantId) => {
  const response = await api.get(
    `api/v1/sellers/product-edit/products/${variantId}`,
  );

  return response.data;
};


export const deleteSellerProduct = async (productId) => {
    const response = await api.delete(
        `/api/v1/sellers/product-edit/products/${productId}`
    );

    return response.data;
};

export const updateVariantStatus = async (
    variantId,
    status
) => {
    const response = await api.patch(
        `/api/v1/sellers/product-edit/variants/${variantId}/status`,
        {
            status
        }
    );

    return response.data;
};

// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (
  productId,
  data
) => {
  const response = await api.patch(
    `/api/v1/sellers/product-edit/products/edit/${productId}`,
    data
  );

  return response.data;
};

// =====================================================
// UPDATE PRODUCT VARIANT
// =====================================================
export const updateProductVariant = async (
  productId,
  variantId,
  formData
) => {
  const response = await api.patch(
    `/api/v1/sellers/product-edit/variants/edit/${variantId}`,
    formData
  );

  return response.data;
};