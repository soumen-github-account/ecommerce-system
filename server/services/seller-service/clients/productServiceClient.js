import axios from "axios";

const productServiceClient = axios.create({
    baseURL: process.env.PRODUCT_SERVICE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "x-internal-service": "seller-service",
        "x-internal-secret":
            process.env.INTERNAL_SERVICE_SECRET,
    },
});

export const getSellerLowStock = async ({
    sellerId,
    limit = 10,
}) => {
    try {
        const response =
            await productServiceClient.get(
                `/internal/products/seller-dashboard/${sellerId}/low-stock`,
                {
                    params: {
                        limit,
                    },
                }
            );

        return response.data;
    } catch (error) {
        console.error(
            "Product Service dashboard error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Product service dashboard request failed"
        );
    }
};