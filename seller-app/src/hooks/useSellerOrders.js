import { useEffect } from "react";
import { toast } from "sonner";

import { useOrderContext } from "../contexts/OrderContext";

import {
  getSellerOrders,
  generateShipment,
  downloadShippingLabel,
  markReadyToShip,
  markPickedUp,
  markDelivered,
  exportOrders,
  schedulePickup,
  markInTransit,
  markOutForDelivery,
} from "../services/orderApi";

export default function useSellerOrders() {
  const {
    state,

    dispatch,
  } = useOrderContext();
  console.log("STATE =", state);

  //--------------------------------------------------
  // Fetch Orders
  //--------------------------------------------------

  const fetchOrders = async (params = {}) => {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const { data } = await getSellerOrders({
        page: state.pagination.page,

        limit: state.pagination.limit,

        search: state.filters.search,

        status: state.filters.status,

        courier: state.filters.courier,

        date: state.filters.date,

        ...params,
      });

      // dispatch({

      //     type: "FETCH_SUCCESS",

      //     payload: {

      //         orders:
      //             data.orders,

      //         pagination:
      //             data.pagination

      //     }

      // });
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });

      dispatch({
        type: "SET_ORDERS",
        payload: {
          orders: data.orders,
          pagination: data.pagination,
        },
      });
    } catch (error) {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });

      dispatch({
        type: "SET_ERROR",
        payload: message,
      });
    }
  };

  //--------------------------------------------------
  // Initial Load
  //--------------------------------------------------

  useEffect(() => {
    fetchOrders();
  }, [
    state.pagination.page,
    state.pagination.limit,
    state.filters.search,
    state.filters.status,
    state.filters.courier,
    state.filters.date,
  ]);

  //--------------------------------------------------
  // Generate Shipment
  //--------------------------------------------------

  const handleGenerateShipment = async (orderId, courier = "Delhivery") => {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      await generateShipment(orderId, {
        courier,
      });

      toast.success("Shipment generated successfully.");

      await fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate shipment.",
      );
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  //--------------------------------------------------
  // NEXT
  //--------------------------------------------------
  const openShipmentModal = (order) => {
    dispatch({
      type: "OPEN_SHIPMENT_MODAL",
      payload: order,
    });
  };

  const closeShipmentModal = () => {
    dispatch({
      type: "CLOSE_SHIPMENT_MODAL",
    });
  };

  const handleDownloadLabel = async (shipmentId) => {
    try {
      const response = await downloadShippingLabel(shipmentId);

      const url = window.URL.createObjectURL(response.data);

      const a = document.createElement("a");

      a.href = url;

      a.download = `Shipping-Label-${shipmentId}.pdf`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReadyToShip = async (shipmentId) => {
    try {
      await markReadyToShip(shipmentId);

      toast.success("Shipment Ready");

      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleSchedulePickup = async (shipmentId) => {
    try {
      await schedulePickup(shipmentId);

      toast.success("Pickup Scheduled");

      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handlePickedUp = async (shipmentId) => {
    try {
      await markPickedUp(shipmentId);

      toast.success("Picked Up");

      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleInTransit = async (shipmentId) => {
    try {
      await markInTransit(shipmentId);

      toast.success("Shipment In Transit");

      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleOutForDelivery = async (shipmentId) => {
    try {
      await markOutForDelivery(shipmentId);

      toast.success("Out For Delivery");

      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleDelivered = async (shipmentId) => {
    try {
      await markDelivered(shipmentId);

      toast.success("Delivered");

      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return {
    state,
    dispatch,
    fetchOrders,
    handleGenerateShipment,
    openShipmentModal,
    closeShipmentModal,
    handleDownloadLabel,

    handleReadyToShip,
    handleSchedulePickup,
    handlePickedUp,
    handleInTransit,
    handleOutForDelivery,
    handleDelivered,
  };
}
