import express from "express"
import { confirmOrder, downloadInvoice, downloadPackingSlip, downloadSelectedLabels, downloadShippingLabel, generateShipment, getSellerOrderById, getSellerOrders, markDelivered, markInTransit, markOutForDelivery, markPickedUp, markReadyToShip, packOrder, schedulePickup } from "../controllers/OrderController.js";
import sellerAuth from "../middlewares/sellerAuth.js";

const router = express.Router();

router.get("/orders", sellerAuth, getSellerOrders);
router.get("/orders/:orderId", sellerAuth, getSellerOrderById);
router.patch("/orders/:orderId/confirm", sellerAuth, confirmOrder);
router.patch("/orders/:orderId/pack", sellerAuth, packOrder);
router.post("/orders/:orderId/generate-shipment", sellerAuth, generateShipment)
router.get("/shipment/:shipmentId/label", sellerAuth, downloadShippingLabel);
router.post("/shipment/download-selected-labels", sellerAuth, downloadSelectedLabels);
router.get(
    "/shipment/:shipmentId/invoice",
    sellerAuth,
    downloadInvoice
);
router.get(
    "/shipment/:shipmentId/packing-slip",
    sellerAuth,
    downloadPackingSlip
);


router.post("/orders/ready-to-ship/:shipmentId", sellerAuth, markReadyToShip);

router.post("/orders/schedule-pickup/:shipmentId", sellerAuth, schedulePickup);

router.post("/orders/picked-up/:shipmentId", sellerAuth, markPickedUp);

router.post("/orders/in-transit/:shipmentId", sellerAuth, markInTransit);

router.post("/orders/out-for-delivery/:shipmentId", sellerAuth, markOutForDelivery);

router.post("/orders/delivered/:shipmentId", sellerAuth, markDelivered);

export default router