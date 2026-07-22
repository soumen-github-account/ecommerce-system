import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const getSellerOrders = (params) =>
    api.get("/seller/orders", { params });

export const getSellerOrderDetails = (orderId) =>
    api.get(`/seller/orders/${orderId}`);

export const generateShipment = (orderId, data) =>
    api.post(
        `/seller/orders/${orderId}/generate-shipment`,
        data
    );

export const downloadShippingLabel = (shipmentId) =>
    api.get(
        `/seller/shipment/${shipmentId}/label`,
        {
            responseType: "blob",
        }
    );

export const exportOrders = (params) =>
    api.get(
        "/seller/orders/export",
        {
            params,
            responseType: "blob",
        }
    );

export const markReadyToShip = (shipmentId) =>
    api.post(`/seller/orders/ready-to-ship/${shipmentId}`);

export const schedulePickup = (shipmentId) =>
    api.post(`/seller/orders/schedule-pickup/${shipmentId}`);

export const markPickedUp = (shipmentId) =>
    api.post(`/seller/orders/picked-up/${shipmentId}`);

export const markInTransit = (shipmentId) =>
    api.post(`/seller/orders/in-transit/${shipmentId}`);

export const markOutForDelivery = (shipmentId) =>
    api.post(`/seller/orders/out-for-delivery/${shipmentId}`);

export const markDelivered = (shipmentId) =>
    api.post(`/seller/orders/delivered/${shipmentId}`);

