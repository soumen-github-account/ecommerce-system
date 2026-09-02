import axios from "axios";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;
const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET;

// =====================================================
// GET ORDER
// =====================================================

export const getOrder = async (orderId) => {

    const response = await axios.get(
        `${ORDER_SERVICE_URL}/internal/orders/get-order/${orderId}`,
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


// =====================================================
// PAYMENT SUCCESS
// =====================================================

export const markOrderPaymentSuccess = async ({
    orderId,
    transactionId,
    paymentProvider
}) => {

    const response = await axios.patch(

        `${ORDER_SERVICE_URL}/internal/orders/${orderId}/payment-success`,

        {
            transactionId,
            paymentProvider
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


// =====================================================
// PAYMENT FAILED
// =====================================================

export const markOrderPaymentFailed = async ({
    orderId,
    reason
}) => {

    const response = await axios.patch(

        `${ORDER_SERVICE_URL}/internal/orders/${orderId}/payment-failed`,

        {
            reason
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