import { Order } from "../models/OrderModel.js";
import { Shipment } from "../models/ShipmentModel.js";

import mongoose from "mongoose";
import { Seller } from "../models/SellerModel.js";
import User from "../models/UserModel.js";
import { generateShipmentNumber } from "../services/shipment/generateShipmentNumber.js";
import { generateTrackingNumber } from "../services/shipment/generateTrackingNumber.js";
import { generateBarcode } from "../services/shipment/barcodeService.js";
import { generateQRCode } from "../services/shipment/qrCodeService.js";
import { generateShippingLabel } from "../services/shipment/shippingLabelService.js";

import fs from "fs";
import path from "path";
import { mergeShippingLabels } from "../services/pdfMergeService.js";

import crypto from "crypto";
import { generateInvoice } from "../services/shipment/invoiceService.js";
import { generatePackingSlip } from "../services/shipment/packingSlipService.js";

export const getSellerOrders = async (req, res) => {
  try {
    //---------------------------------------
    // Seller
    //---------------------------------------

    const sellerId = req.seller._id;

    //---------------------------------------
    // Query Params
    //---------------------------------------

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = req.query.search?.trim() || "";

    const status = req.query.status || "";

    const date = req.query.date || "";

    const skip = (page - 1) * limit;

    //---------------------------------------
    // Get Orders
    //---------------------------------------

    let orders = await Order.find({
      "items.seller": sellerId,
    })

      .populate({
        path: "user",

        select: "firstName lastName email phone",
      })

      .populate({
        path: "items.product",

        select: "title brand slug",
      })

      .populate({
        path: "items.variant",

        select: "variantName sku images",
      })

      .sort({
        createdAt: -1,
      });

    //---------------------------------------
    // Keep Seller Items Only
    //---------------------------------------

    // let sellerOrders = orders.map(order => {

    //     const sellerItems = order.items.filter(item =>

    //         item.seller.toString() === sellerId.toString()

    //     );

    //     return {

    //         _id: order._id,

    //         orderNumber: order.orderNumber,

    //         status: order.status,

    //         createdAt: order.createdAt,

    //         updatedAt: order.updatedAt,

    //         payment: order.payment,

    //         pricing: order.pricing,

    //         shippingAddress: order.shippingAddress,

    //         user: order.user,

    //         items: sellerItems,
    //         shipment

    //     };

    // });

    const sellerOrders = await Promise.all(
      orders.map(async (order) => {
        const sellerItems = order.items.filter(
          (item) => item.seller.toString() === sellerId.toString(),
        );

        const shipment = await Shipment.findOne({
          order: order._id,
          seller: sellerId,
        });

        return {
          _id: order._id,

          orderNumber: order.orderNumber,

          status: order.status,

          createdAt: order.createdAt,

          updatedAt: order.updatedAt,

          payment: order.payment,

          pricing: order.pricing,

          shippingAddress: order.shippingAddress,

          user: order.user,

          items: sellerItems,

          shipment, // <-- add this
        };
      }),
    );

    //---------------------------------------
    // Search
    //---------------------------------------

    if (search) {
      const keyword = search.toLowerCase();

      sellerOrders = sellerOrders.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(keyword) ||
          order.shippingAddress?.fullName?.toLowerCase().includes(keyword) ||
          order.user?.email?.toLowerCase().includes(keyword),
      );
    }

    //---------------------------------------
    // Status Filter
    //---------------------------------------

    if (status) {
      sellerOrders = sellerOrders.filter((order) => order.status === status);
    }

    //---------------------------------------
    // Date Filter
    //---------------------------------------

    if (date) {
      sellerOrders = sellerOrders.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];

        return orderDate === date;
      });
    }

    //---------------------------------------
    // Pagination
    //---------------------------------------

    const total = sellerOrders.length;

    const paginatedOrders = sellerOrders.slice(
      skip,

      skip + limit,
    );

    //---------------------------------------
    // Response
    //---------------------------------------

    return res.status(200).json({
      success: true,

      orders: paginatedOrders,

      pagination: {
        page,

        limit,

        total,

        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getSellerOrderById = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const { orderId } = req.params;

    //--------------------------------------
    // Find Order
    //--------------------------------------

    const order = await Order.findOne({
      _id: orderId,

      "items.seller": sellerId,
    })

      .populate({
        path: "user",

        select: "fullName email phone",
      })

      .populate({
        path: "items.product",

        select: "title brand slug manufacturer countryOfOrigin",
      })

      .populate({
        path: "items.variant",

        select: "variantName sku barcode images pricing inventory shipping",
      });

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    //--------------------------------------
    // Keep Only Seller Items
    //--------------------------------------

    const sellerItems = order.items.filter(
      (item) => item.seller.toString() === sellerId.toString(),
    );

    //--------------------------------------
    // Shipment
    //--------------------------------------

    const shipment = await Shipment.findOne({
      order: order._id,

      seller: sellerId,
    });

    //--------------------------------------
    // Response
    //--------------------------------------

    return res.status(200).json({
      success: true,

      order: {
        _id: order._id,

        orderNumber: order.orderNumber,

        status: order.status,

        createdAt: order.createdAt,

        updatedAt: order.updatedAt,

        pricing: order.pricing,

        payment: order.payment,

        shippingAddress: order.shippingAddress,

        customer: order.user,

        items: sellerItems,

        shipment,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const { orderId } = req.params;

    //------------------------------------
    // Find Order
    //------------------------------------

    const order = await Order.findOne({
      _id: orderId,

      "items.seller": sellerId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    //------------------------------------
    // Confirm Only Seller Items
    //------------------------------------

    order.items.forEach((item) => {
      if (
        item.seller.toString() === sellerId.toString() &&
        item.status === "PLACED"
      ) {
        item.status = "CONFIRMED";
      }
    });

    //------------------------------------
    // If All Items Confirmed
    //------------------------------------

    const allConfirmed = order.items.every(
      (item) => item.status === "CONFIRMED",
    );

    if (allConfirmed) {
      order.status = "CONFIRMED";
    }

    //------------------------------------
    // Save
    //------------------------------------

    await order.save();

    //------------------------------------
    // Response
    //------------------------------------

    return res.status(200).json({
      success: true,

      message: "Order confirmed successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const packOrder = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const { orderId } = req.params;

    //------------------------------------
    // Find Order
    //------------------------------------

    const order = await Order.findOne({
      _id: orderId,

      "items.seller": sellerId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    //------------------------------------
    // Pack Seller Items
    //------------------------------------

    order.items.forEach((item) => {
      if (
        item.seller.toString() === sellerId.toString() &&
        item.status === "CONFIRMED"
      ) {
        item.status = "PACKED";
      }
    });

    //------------------------------------
    // Update Order Status
    //------------------------------------

    const allPacked = order.items.every((item) => item.status === "PACKED");

    if (allPacked) {
      order.status = "PACKED";
    }

    //------------------------------------
    // Save
    //------------------------------------

    await order.save();

    return res.status(200).json({
      success: true,

      message: "Order packed successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const createShipment = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const { orderId } = req.params;

    //------------------------------------
    // Find Order
    //------------------------------------

    const order = await Order.findOne({
      _id: orderId,

      "items.seller": sellerId,
    })

      .populate("items.variant");

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    //------------------------------------
    // Shipment Already Exists
    //------------------------------------

    const existingShipment = await Shipment.findOne({
      order: order._id,

      seller: sellerId,
    });

    if (existingShipment) {
      return res.status(400).json({
        success: false,

        message: "Shipment already generated.",
      });
    }

    //------------------------------------
    // Seller Items
    //------------------------------------

    const sellerItems = order.items.filter(
      (item) => item.seller.toString() === sellerId.toString(),
    );

    //------------------------------------
    // Calculate Package Weight
    //------------------------------------

    let totalWeight = 0;

    sellerItems.forEach((item) => {
      const weight = item.variant?.shipping?.weight || 0;

      totalWeight += weight * item.quantity;
    });

    //------------------------------------
    // Generate Numbers
    //------------------------------------

    const shipmentNumber = "SHP" + Date.now();

    const trackingNumber =
      "TRK" + crypto.randomBytes(6).toString("hex").toUpperCase();

    //------------------------------------
    // Create Shipment
    //------------------------------------

    const shipment = await Shipment.create({
      order: order._id,

      user: order.user,

      seller: sellerId,

      shipmentNumber,

      trackingNumber,

      status: "LABEL_GENERATED",

      shippingAddress: order.shippingAddress,

      package: {
        weight: totalWeight,

        length: 0,

        breadth: 0,

        height: 0,

        volumetricWeight: 0,
      },

      labelGeneratedAt: new Date(),

      logs: [
        {
          status: "LABEL_GENERATED",

          description: "Shipment created.",

          updatedBy: "SELLER",
        },
      ],
    });

    //------------------------------------
    // Response
    //------------------------------------

    return res.status(201).json({
      success: true,

      shipment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const generateShipment = async (req, res) => {
  const mongoSession = await mongoose.startSession();

  try {
    await mongoSession.startTransaction();

    //------------------------------------
    // Seller
    //------------------------------------

    const sellerId = req.seller._id;

    //------------------------------------
    // Params
    //------------------------------------

    const orderId = req.params.orderId;

    const { courier } = req.body;
    console.log("params =", req.params);
    console.log("body =", req.body);
    console.log("orderId =", req.params.orderId);

    //------------------------------------
    // Validate
    //------------------------------------

    if (!orderId) {
      await mongoSession.abortTransaction();

      return res.status(400).json({
        success: false,

        message: "Order Id is required",
      });
    }

    //------------------------------------
    // Order
    //------------------------------------

    const order = await Order.findById(orderId).session(mongoSession);

    if (!order) {
      await mongoSession.abortTransaction();

      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    //------------------------------------
    // Seller Exists
    //------------------------------------

    const seller = await Seller.findById(sellerId).session(mongoSession);

    if (!seller) {
      await mongoSession.abortTransaction();

      return res.status(404).json({
        success: false,

        message: "Seller not found",
      });
    }

    //------------------------------------
    // Seller Approved
    //------------------------------------

    if (seller.status !== "Approved") {
      await mongoSession.abortTransaction();

      return res.status(403).json({
        success: false,

        message: "Seller is not approved",
      });
    }

    //------------------------------------
    // Seller Items
    //------------------------------------

    const sellerItems = order.items.filter(
      (item) => item.seller.toString() === sellerId.toString(),
    );

    if (sellerItems.length === 0) {
      await mongoSession.abortTransaction();

      return res.status(403).json({
        success: false,

        message: "You are not authorized for this order",
      });
    }

    //------------------------------------
    // Shipment Already Exists
    //------------------------------------

    const alreadyShipment = await Shipment.findOne({
      order: order._id,

      seller: sellerId,
    }).session(mongoSession);

    if (alreadyShipment) {
      await mongoSession.abortTransaction();

      return res.status(400).json({
        success: false,

        message: "Shipment already generated",
      });
    }

    //--------------------------------------------------
    // NEXT PART
    // Shipment Number
    // Tracking Number
    // Barcode
    // QR
    // Shipping Label
    //--------------------------------------------------
    //------------------------------------
    // Shipment Number
    //------------------------------------

    const shipmentNumber = generateShipmentNumber();

    //------------------------------------
    // Tracking Number
    //------------------------------------

    const trackingNumber = generateTrackingNumber();

    //------------------------------------
    // Shipment Object
    //------------------------------------

    const shipmentData = {
      shipmentNumber,

      trackingNumber,

      orderNumber: order.orderNumber,

      seller: seller._id,
    };

    //------------------------------------
    // Barcode
    //------------------------------------

    const barcode = await generateBarcode(trackingNumber);

    //------------------------------------
    // QR Code
    //------------------------------------

    const qr = await generateQRCode(shipmentData);

    //------------------------------------
    // Shipment Instance
    //------------------------------------

    const shipment = new Shipment({
      order: order._id,

      user: order.user,

      seller: seller._id,

      items: sellerItems.map((item) => ({
        product: item.product,

        variant: item.variant,

        sku: item.sku,

        quantity: item.quantity,
      })),

      shipmentNumber,

      trackingNumber,

      courier: courier || "",

      shippingAddress: order.shippingAddress,

      shippingCharge: order.pricing.shippingCharge,

      barcodeImage: barcode.filePath,

      qrCodeImage: qr.filePath,

      labelGeneratedAt: new Date(),

      status: "LABEL_GENERATED",

      logs: [
        {
          status: "LABEL_GENERATED",

          description: "Shipping label generated",

          updatedBy: "SELLER",
        },
      ],
    });

    //------------------------------------
    // Shipping Label PDF
    //------------------------------------

    const shippingLabel = await generateShippingLabel(
      shipment,

      seller,

      order,

      barcode.filePath,

      qr.filePath,
    );

    //------------------------------------
    // Invoice PDF
    //------------------------------------

    const invoice = await generateInvoice(
      shipment,

      seller,

      order,
    );

    //------------------------------------
    // Packing Slip PDF
    //------------------------------------

    const packingSlip = await generatePackingSlip(
      shipment,

      seller,

      order,
    );

    //------------------------------------
    // Save Document Paths
    //------------------------------------

    shipment.documents = {
      shippingLabelPdf: shippingLabel.filePath,

      invoicePdf: invoice.filePath,

      packingSlipPdf: packingSlip.filePath,
    };

    shipment.invoiceGeneratedAt = new Date();

    shipment.packingSlipGeneratedAt = new Date();

    //--------------------------------------------------
    // NEXT PART
    // Save Shipment
    // Update Order
    // Commit Transaction
    // Response
    //--------------------------------------------------
    //------------------------------------
    // Save Shipment
    //------------------------------------

    await shipment.save({
      session: mongoSession,
    });

    //------------------------------------
    // Update Seller Items
    //------------------------------------

    order.items.forEach((item) => {
      if (item.seller.toString() === sellerId.toString()) {
        item.status = "PACKED";
      }
    });

    //------------------------------------
    // Update Order Status
    //------------------------------------

    const allPacked = order.items.every((item) => item.status === "PACKED");

    if (allPacked) {
      order.status = "PACKED";
    }

    await order.save({
      session: mongoSession,
    });

    //------------------------------------
    // Commit
    //------------------------------------

    await mongoSession.commitTransaction();

    //------------------------------------
    // Response
    //------------------------------------

    return res.status(201).json({
      success: true,

      message: "Shipment generated successfully",

      shipment,
    });
  } catch (error) {
    await mongoSession.abortTransaction();

    console.error(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  } finally {
    mongoSession.endSession();
  }
};

export const downloadShippingLabel = async (req, res) => {
  try {
    //------------------------------------
    // Params
    //------------------------------------

    const { shipmentId } = req.params;

    const sellerId = req.seller._id;
    //------------------------------------
    // Validate
    //------------------------------------

    if (!shipmentId) {
      return res.status(400).json({
        success: false,

        message: "Shipment Id is required",
      });
    }

    //------------------------------------
    // Shipment
    //------------------------------------

    const shipment = await Shipment.findOne({
      _id: shipmentId,

      seller: sellerId,
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,

        message: "Shipment not found",
      });
    }

    //------------------------------------
    // Shipping Label Exists
    //------------------------------------

    if (!shipment.documents || !shipment.documents.shippingLabelPdf) {
      return res.status(404).json({
        success: false,

        message: "Shipping label not generated",
      });
    }

    //------------------------------------
    // File Path
    //------------------------------------

    const filePath = path.resolve(shipment.documents.shippingLabelPdf);

    //------------------------------------
    // Exists
    //------------------------------------

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,

        message: "Shipping label file not found",
      });
    }

    //------------------------------------
    // Download
    //------------------------------------

    return res.download(
      filePath,

      `${shipment.shipmentNumber}.pdf`,
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const downloadSelectedLabels = async (req, res) => {
  try {
    //------------------------------------
    // Seller
    //------------------------------------

    const sellerId = req.seller._id;

    //------------------------------------
    // Body
    //------------------------------------

    const { shipmentIds } = req.body;

    //------------------------------------
    // Validate
    //------------------------------------

    if (
      !shipmentIds ||
      !Array.isArray(shipmentIds) ||
      shipmentIds.length === 0
    ) {
      return res.status(400).json({
        success: false,

        message: "Shipment ids are required",
      });
    }

    //------------------------------------
    // Find Shipments
    //------------------------------------

    const shipments = await Shipment.find({
      _id: {
        $in: shipmentIds,
      },

      seller: sellerId,
    });

    if (shipments.length === 0) {
      return res.status(404).json({
        success: false,

        message: "No shipment found",
      });
    }

    //------------------------------------
    // PDF Files
    //------------------------------------

    const pdfFiles = [];

    for (const shipment of shipments) {
      if (shipment.documents && shipment.documents.shippingLabelPdf) {
        const filePath = path.resolve(shipment.documents.shippingLabelPdf);

        if (fs.existsSync(filePath)) {
          pdfFiles.push(filePath);
        }
      }
    }

    //------------------------------------
    // Validate PDFs
    //------------------------------------

    if (pdfFiles.length === 0) {
      return res.status(404).json({
        success: false,

        message: "No shipping labels found",
      });
    }

    //------------------------------------
    // Merge PDFs
    //------------------------------------

    const mergedPdf = await mergeShippingLabels(pdfFiles);

    //------------------------------------
    // Download
    //------------------------------------

    return res.download(
      mergedPdf.filePath,

      mergedPdf.fileName,
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    //------------------------------------
    // Seller
    //------------------------------------

    const sellerId = req.seller._id;

    //------------------------------------
    // Params
    //------------------------------------

    const { shipmentId } = req.params;

    //------------------------------------
    // Validate
    //------------------------------------

    if (!shipmentId) {
      return res.status(400).json({
        success: false,

        message: "Shipment Id is required",
      });
    }

    //------------------------------------
    // Shipment
    //------------------------------------

    const shipment = await Shipment.findOne({
      _id: shipmentId,

      seller: sellerId,
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,

        message: "Shipment not found",
      });
    }

    //------------------------------------
    // Invoice Exists
    //------------------------------------

    if (!shipment.documents || !shipment.documents.invoicePdf) {
      return res.status(404).json({
        success: false,

        message: "Invoice not generated",
      });
    }

    //------------------------------------
    // File Path
    //------------------------------------

    const filePath = path.resolve(shipment.documents.invoicePdf);

    //------------------------------------
    // Exists
    //------------------------------------

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,

        message: "Invoice file not found",
      });
    }

    //------------------------------------
    // Download
    //------------------------------------

    return res.download(
      filePath,

      `Invoice-${shipment.shipmentNumber}.pdf`,
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const downloadPackingSlip = async (req, res) => {
  try {
    //------------------------------------
    // Seller
    //------------------------------------

    const sellerId = req.seller._id;

    //------------------------------------
    // Params
    //------------------------------------

    const { shipmentId } = req.params;

    //------------------------------------
    // Validate
    //------------------------------------

    if (!shipmentId) {
      return res.status(400).json({
        success: false,

        message: "Shipment Id is required",
      });
    }

    //------------------------------------
    // Shipment
    //------------------------------------

    const shipment = await Shipment.findOne({
      _id: shipmentId,

      seller: sellerId,
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,

        message: "Shipment not found",
      });
    }

    //------------------------------------
    // Packing Slip Exists
    //------------------------------------

    if (!shipment.documents || !shipment.documents.packingSlipPdf) {
      return res.status(404).json({
        success: false,

        message: "Packing Slip not generated",
      });
    }

    //------------------------------------
    // File Path
    //------------------------------------

    const filePath = path.resolve(shipment.documents.packingSlipPdf);

    //------------------------------------
    // File Exists
    //------------------------------------

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,

        message: "Packing Slip file not found",
      });
    }

    //------------------------------------
    // Download
    //------------------------------------

    return res.download(
      filePath,

      `PackingSlip-${shipment.shipmentNumber}.pdf`,
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};


export const markReadyToShip = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });
    }

    if (shipment.status !== "LABEL_GENERATED") {
      return res.status(400).json({
        success: false,
        message: "Shipment label is not generated.",
      });
    }

    shipment.status = "READY_TO_SHIP";

    shipment.logs.push({
      status: "READY_TO_SHIP",
      location: "Seller Warehouse",
      description: "Shipment packed and ready to ship.",
      updatedBy: "SELLER",
    });

    await shipment.save();

    await Order.findByIdAndUpdate(
      shipment.order,
      {
        status: "PACKED",
      }
    );

    return res.json({
      success: true,
      message: "Shipment is ready to ship.",
      shipment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const schedulePickup = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });
    }

    if (shipment.status !== "READY_TO_SHIP") {
      return res.status(400).json({
        success: false,
        message: "Shipment is not ready for pickup.",
      });
    }

    shipment.status = "PICKUP_SCHEDULED";

    shipment.pickupDate = new Date();

    shipment.logs.push({
      status: "PICKUP_SCHEDULED",
      location: "Seller Warehouse",
      description: "Pickup scheduled.",
      updatedBy: "SELLER",
    });

    await shipment.save();

    return res.json({
      success: true,
      message: "Pickup scheduled successfully.",
      shipment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markPickedUp = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });
    }

    if (shipment.status !== "PICKUP_SCHEDULED") {
      return res.status(400).json({
        success: false,
        message: "Pickup is not scheduled.",
      });
    }

    shipment.status = "PICKED_UP";

    shipment.shippedAt = new Date();

    shipment.logs.push({
      status: "PICKED_UP",
      location: "Seller Warehouse",
      description: "Courier picked up shipment.",
      updatedBy: "COURIER",
    });

    await shipment.save();

    await Order.findByIdAndUpdate(
      shipment.order,
      {
        status: "SHIPPED",
      }
    );

    return res.json({
      success: true,
      message: "Shipment picked up.",
      shipment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markInTransit = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment)
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });

    shipment.status = "IN_TRANSIT";

    shipment.logs.push({
      status: "IN_TRANSIT",
      location: "Transit Hub",
      description: "Shipment is in transit.",
      updatedBy: "COURIER",
    });

    await shipment.save();

    return res.json({
      success: true,
      message: "Shipment is now in transit.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markOutForDelivery = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment)
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });

    shipment.status = "OUT_FOR_DELIVERY";

    shipment.outForDeliveryAt = new Date();

    shipment.logs.push({
      status: "OUT_FOR_DELIVERY",
      location: shipment.shippingAddress.city,
      description: "Shipment is out for delivery.",
      updatedBy: "COURIER",
    });

    await shipment.save();

    return res.json({
      success: true,
      message: "Shipment is out for delivery.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markDelivered = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment)
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });

    shipment.status = "DELIVERED";

    shipment.deliveredAt = new Date();

    shipment.logs.push({
      status: "DELIVERED",
      location: shipment.shippingAddress.city,
      description: "Shipment delivered successfully.",
      updatedBy: "COURIER",
    });

    await shipment.save();

    await Order.findByIdAndUpdate(
      shipment.order,
      {
        status: "DELIVERED",
      }
    );

    return res.json({
      success: true,
      message: "Shipment delivered successfully.",
      shipment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

