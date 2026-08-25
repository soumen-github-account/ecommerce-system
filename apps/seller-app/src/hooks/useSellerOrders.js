import { useEffect, useCallback } from "react";
import { toast } from "sonner";

import { useOrderContext } from "../contexts/OrderContext";

import {
  getSellerOrders,
  getSellerOrderStats,
  generateShipment,
  downloadShippingLabel,
  markReadyToShip,
  markPickedUp,
  markDelivered,
  schedulePickup,
  markInTransit,
  markOutForDelivery,
} from "../services/orderApi";

export default function useSellerOrders() {
  const { state, dispatch } = useOrderContext();

  //--------------------------------------------------
  // Fetch Orders
  //--------------------------------------------------

  const fetchOrders = useCallback(
    async (params = {}) => {
      try {
        dispatch({
          type: "SET_LOADING",
          payload: true,
        });

        //------------------------------------------
        // FINAL API PARAMS
        //------------------------------------------

        const finalParams = {
          page: params.page ?? state.pagination?.page ?? 1,

          limit: params.limit ?? state.pagination?.limit ?? 10,

          search:
            params.search !== undefined
              ? params.search
              : state.filters?.search || "",

          status:
            params.status !== undefined
              ? params.status
              : state.filters?.status || "",

          courier:
            params.courier !== undefined
              ? params.courier
              : state.filters?.courier || "",

          paymentStatus:
            params.paymentStatus !== undefined
              ? params.paymentStatus
              : state.filters?.paymentStatus || "",

          date:
            params.date !== undefined ? params.date : state.filters?.date || "",
        };

        //------------------------------------------
        // DEBUG
        //------------------------------------------

        console.log("[SELLER] FINAL API PARAMS:", finalParams);

        //==================================================
        // ORDERS API
        //==================================================

        const ordersResponse = await getSellerOrders(finalParams);

        const ordersData = ordersResponse?.data;

        console.log("[SELLER] ORDERS RESPONSE:", ordersData);

        //------------------------------------------
        // SET ORDERS
        //------------------------------------------

        dispatch({
          type: "SET_ORDERS",
          payload: {
            orders: ordersData?.orders || [],

            pagination: ordersData?.pagination || {
              page: finalParams.page,
              limit: finalParams.limit,
              total: 0,
              totalPages: 0,
            },
          },
        });

        //==================================================
        // STATS API
        //==================================================

        try {
          console.log("[SELLER] FETCHING ORDER STATS...");

          const statsResponse = await getSellerOrderStats();

          const statsData = statsResponse?.data;

          console.log("[SELLER] ORDER STATS RESPONSE:", statsData);

          //------------------------------------------
          // SET STATS
          //------------------------------------------

          dispatch({
            type: "SET_STATS",
            payload: statsData?.stats || statsData || {},
          });
        } catch (statsError) {
          console.error(
            "[SELLER] FETCH ORDER STATS ERROR:",
            statsError.response?.data || statsError.message,
          );
        }
      } catch (error) {
        console.error(
          "[SELLER] FETCH ORDERS ERROR:",
          error.response?.data || error.message,
        );

        dispatch({
          type: "SET_ERROR",
          payload: error.response?.data?.message || "Failed to fetch orders",
        });
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      }
    },

    [
      state.pagination?.page,
      state.pagination?.limit,

      state.filters?.search,
      state.filters?.status,
      state.filters?.courier,
      state.filters?.paymentStatus,
      state.filters?.date,

      dispatch,
    ],
  );

  useEffect(() => {
    fetchOrders();
  }, [
    state.pagination?.page,
    state.pagination?.limit,

    state.filters?.search,
    state.filters?.status,
    state.filters?.courier,
    state.filters?.paymentStatus,
    state.filters?.date,

    fetchOrders,
  ]);

  //--------------------------------------------------
  // APPLY FILTERS
  //--------------------------------------------------

  const applyFilters = useCallback(
    (filters = {}) => {
      console.log("[SELLER] APPLY FILTERS:", filters);

      //------------------------------------------
      // Save Filters
      //------------------------------------------

      dispatch({
        type: "SET_FILTERS",
        payload: {
          search: filters.search || "",

          status: filters.status || "",

          courier: filters.courier || "",

          paymentStatus: filters.paymentStatus || "",

          date: filters.date || "",
        },
      });

      //------------------------------------------
      // Reset Page To 1
      //------------------------------------------

      dispatch({
        type: "SET_PAGINATION",
        payload: {
          page: 1,
        },
      });
    },
    [dispatch],
  );

  //--------------------------------------------------
  // RESET FILTERS
  //--------------------------------------------------

  const resetFilters = useCallback(() => {
    console.log("[SELLER] RESET FILTERS");

    dispatch({
      type: "SET_FILTERS",
      payload: {
        search: "",
        status: "",
        courier: "",
        paymentStatus: "",
        date: "",
      },
    });

    dispatch({
      type: "SET_PAGINATION",
      payload: {
        page: 1,
      },
    });
  }, [dispatch]);

  //--------------------------------------------------
  // GENERATE SHIPMENT
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
  // OPEN SHIPMENT MODAL
  //--------------------------------------------------

  const openShipmentModal = (order) => {
    dispatch({
      type: "OPEN_SHIPMENT_MODAL",
      payload: order,
    });
  };

  //--------------------------------------------------
  // CLOSE SHIPMENT MODAL
  //--------------------------------------------------

  const closeShipmentModal = () => {
    dispatch({
      type: "CLOSE_SHIPMENT_MODAL",
    });
  };

  //--------------------------------------------------
  // DOWNLOAD SHIPPING LABEL
  //--------------------------------------------------

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
    } catch (error) {
      console.error("[SELLER] DOWNLOAD LABEL ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to download shipping label.",
      );
    }
  };

  //--------------------------------------------------
  // READY TO SHIP
  //--------------------------------------------------

  const handleReadyToShip = async (shipmentId) => {
    try {
      await markReadyToShip(shipmentId);

      toast.success("Shipment Ready");

      await fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update shipment.",
      );
    }
  };

  //--------------------------------------------------
  // SCHEDULE PICKUP
  //--------------------------------------------------

  const handleSchedulePickup = async (shipmentId) => {
    try {
      await schedulePickup(shipmentId);

      toast.success("Pickup Scheduled");

      await fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to schedule pickup.",
      );
    }
  };

  //--------------------------------------------------
  // PICKED UP
  //--------------------------------------------------

  const handlePickedUp = async (shipmentId) => {
    try {
      await markPickedUp(shipmentId);

      toast.success("Picked Up");

      await fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update shipment.",
      );
    }
  };

  //--------------------------------------------------
  // IN TRANSIT
  //--------------------------------------------------

  const handleInTransit = async (shipmentId) => {
    try {
      await markInTransit(shipmentId);

      toast.success("Shipment In Transit");

      await fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update shipment.",
      );
    }
  };

  //--------------------------------------------------
  // OUT FOR DELIVERY
  //--------------------------------------------------

  const handleOutForDelivery = async (shipmentId) => {
    try {
      await markOutForDelivery(shipmentId);

      toast.success("Out For Delivery");

      await fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update shipment.",
      );
    }
  };

  //--------------------------------------------------
  // DELIVERED
  //--------------------------------------------------

  const handleDelivered = async (shipmentId) => {
    try {
      await markDelivered(shipmentId);

      toast.success("Delivered");

      await fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update shipment.",
      );
    }
  };

  //--------------------------------------------------
  // RETURN
  //--------------------------------------------------

  return {
    state,

    dispatch,

    fetchOrders,

    applyFilters,

    resetFilters,

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
