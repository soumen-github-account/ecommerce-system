import axios from "axios";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET;


// =====================================================
// CLEAR CART
// =====================================================

export const clearCart = async ({
    userId,
    orderId
}) => {

    const response = await axios.delete(

        `${USER_SERVICE_URL}/internal/cart`,

        {
            data: {
                userId,
                orderId
            },

            headers: {
                "x-internal-service-secret":
                    INTERNAL_SERVICE_SECRET
            },

            timeout: 10000
        }
    );

    return response.data;
};