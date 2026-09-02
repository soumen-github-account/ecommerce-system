import axios from "axios";

const orderServiceClient = axios.create({

    baseURL: process.env.ORDER_SERVICE_URL,

    timeout: 10000,

    headers: {
        "Content-Type": "application/json",
        "x-internal-service": "seller-service",
        "x-internal-secret":
            process.env.INTERNAL_SERVICE_SECRET,
    },

});

export const getSellerOrderDashboard = async ({
    sellerId,
    from,
    to,
    previousFrom,
    previousTo,
}) => {

    const response =
        await orderServiceClient.get(
            `/internal/orders/seller-dashboard/${sellerId}`,
            {
                params: {
                    from,
                    to,
                    previousFrom,
                    previousTo,
                },
            }
        );

    return response.data;
};