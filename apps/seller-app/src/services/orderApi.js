import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const getSellerOrders = (params) =>
    api.get("/api/v1/sellers/seller/orders", { params });

export const getSellerOrderStats = () =>
    api.get("/api/v1/sellers/seller/orders/stats");

export const getSellerOrderDetails = (orderId) =>
    api.get(`/api/v1/sellers/seller/orders/${orderId}`);

export const generateShipment = (orderId, data) =>
    api.post(
        `/api/v1/sellers/seller/orders/${orderId}/generate-shipment`,
        data
    );

export const downloadShippingLabel = (shipmentId) =>
    api.get(
        `/api/v1/sellers/seller/shipment/${shipmentId}/label`,
        {
            responseType: "blob",
        }
    );

export const exportOrders = (params) =>
    api.get(
        "/api/v1/sellers/seller/orders/export",
        {
            params,
            responseType: "blob",
        }
    );

export const markReadyToShip = (shipmentId) =>
    api.post(`/api/v1/sellers/seller/orders/ready-to-ship/${shipmentId}`);

export const schedulePickup = (shipmentId) =>
    api.post(`/api/v1/sellers/seller/orders/schedule-pickup/${shipmentId}`);

export const markPickedUp = (shipmentId) =>
    api.post(`/api/v1/sellers/seller/orders/picked-up/${shipmentId}`);

export const markInTransit = (shipmentId) =>
    api.post(`/api/v1/sellers/seller/orders/in-transit/${shipmentId}`);

export const markOutForDelivery = (shipmentId) =>
    api.post(`/api/v1/sellers/seller/orders/out-for-delivery/${shipmentId}`);

export const markDelivered = (shipmentId) =>
    api.post(`/api/v1/sellers/seller/orders/delivered/${shipmentId}`);

