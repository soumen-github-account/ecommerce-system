import axios from "axios";

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET;


// =====================================================
// REDUCE STOCK
// =====================================================

export const reduceStock = async ({
    orderId,
    items
}) => {

    const response = await axios.post(

        `${PRODUCT_SERVICE_URL}/internal/products/reduce-stock`,

        {
            orderId,
            items
        },

        {
            headers: {
                "x-internal-service-secret":
                    INTERNAL_SERVICE_SECRET
            },

            timeout: 10000
        }
    );

    return response.data;
};