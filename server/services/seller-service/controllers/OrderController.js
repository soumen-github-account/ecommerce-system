import mongoose from "mongoose";
import { Seller } from "../models/SellerModel.js";
import { Shipment } from "../models/ShipmentModel.js";
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
import axios from "axios";

const cleanString = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  const cleaned = value.trim();

  if (
    !cleaned ||
    cleaned === "," ||
    cleaned === ",," ||
    cleaned === "null" ||
    cleaned === "undefined"
  ) {
    return "";
  }

  return cleaned;
};

export const getSellerOrders = async (req, res) => {
  try {
    //------------------------------------------
    // Seller
    //------------------------------------------

    const sellerId = req.seller?._id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication required",
      });
    }

    //------------------------------------------
    // Query Params
    //------------------------------------------

    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;

    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;

    const search = cleanString(req.query.search);

    const status = cleanString(req.query.status);

    const courier = cleanString(req.query.courier);
    const paymentStatus = cleanString(req.query.paymentStatus);

    const date = cleanString(req.query.date);

    console.log("[SELLER] FILTERS:", {
      page,
      limit,
      search,
      status,
      courier,
      date,
    });

    const orderResponse = await axios.post(
      `${process.env.ORDER_SERVICE_URL}/internal/seller/orders`,

      {
        sellerId: sellerId.toString(),
      },

      {
        headers: {
          Authorization: req.headers.authorization || "",
        },

        timeout: 10000,
      },
    );

    //------------------------------------------
    // Orders From Order Service
    //------------------------------------------

    let orders = orderResponse.data?.orders || [];

    //------------------------------------------
    // Build Seller Orders
    //------------------------------------------

    let sellerOrders = await Promise.all(
      orders.map(async (order) => {
        //--------------------------------
        // USER SERVICE
        //--------------------------------

        let user = null;

        try {
          if (order.user) {
            const userResponse = await axios.get(
              `${process.env.USER_SERVICE_URL}/users/internal/user/${order.user}`,

              {
                headers: {
                  Authorization: req.headers.authorization || "",
                },

                timeout: 5000,
              },
            );

            if (userResponse.data?.success) {
              user = userResponse.data.user;
            }
          }
        } catch (error) {
          console.error(
            "[SELLER] USER SERVICE ERROR:",
            error.response?.data || error.message,
          );
        }

        //--------------------------------
        // PRODUCT SERVICE
        //--------------------------------

        let items = order.items || [];

        try {
          if (items.length > 0) {
            const productResponse = await axios.post(
              `${process.env.PRODUCT_SERVICE_URL}/internal/order-products-internal`,

              {
                items: items.map((item) => ({
                  productId: item.product,

                  variantId: item.variant,
                })),
              },

              {
                headers: {
                  Authorization: req.headers.authorization || "",
                },

                timeout: 5000,
              },
            );

            if (productResponse.data?.success) {
              const productItems =
                productResponse.data.items ||
                productResponse.data.products ||
                [];

              //--------------------------------
              // Merge Product Data
              //--------------------------------

              items = items.map((item) => {
                const product = productItems.find((p) => {
                  return (
                    String(p.productId || p._id || p.product) ===
                    String(item.product)
                  );
                });

                if (!product) {
                  return item;
                }

                return {
                  ...item,

                  product: product.product || product.productData || product,

                  variant:
                    product.variant || product.variantData || item.variant,
                };
              });
            }
          }
        } catch (error) {
          console.error(
            "[SELLER] PRODUCT SERVICE ERROR:",
            error.response?.data || error.message,
          );
        }

        //--------------------------------
        // SHIPMENT
        //--------------------------------

        let shipment = null;

        try {
          shipment = await Shipment.findOne({
            order: order._id,

            seller: sellerId,
          }).lean();
        } catch (error) {
          console.error("[SELLER] SHIPMENT ERROR:", error.message);
        }

        //--------------------------------
        // FINAL ORDER
        //--------------------------------

        return {
          _id: order._id,

          orderNumber: order.orderNumber,

          status: order.status,

          createdAt: order.createdAt,

          updatedAt: order.updatedAt,

          payment: order.payment,

          pricing: order.pricing,

          shippingAddress: order.shippingAddress,

          user,

          items,

          shipment,
        };
      }),
    );

    //==================================================
    // SEARCH FILTER
    //==================================================

    if (search) {
      const keyword = search.toLowerCase();

      sellerOrders = sellerOrders.filter((order) => {
        const orderNumber = String(order.orderNumber || "").toLowerCase();

        const customerName = String(
          order.user?.fullName ||
            order.user?.firstName ||
            order.shippingAddress?.fullName ||
            "",
        ).toLowerCase();

        const email = String(
          order.user?.email || order.shippingAddress?.email || "",
        ).toLowerCase();

        const phone = String(
          order.user?.phone || order.shippingAddress?.phone || "",
        ).toLowerCase();

        const productName = (order.items || []).some((item) => {
          const title = String(item.product?.title || "").toLowerCase();

          const sku = String(item.sku || item.variant?.sku || "").toLowerCase();

          return title.includes(keyword) || sku.includes(keyword);
        });

        return (
          orderNumber.includes(keyword) ||
          customerName.includes(keyword) ||
          email.includes(keyword) ||
          phone.includes(keyword) ||
          productName
        );
      });
    }

    //==================================================
    // STATUS FILTER
    //==================================================

    if (status) {
      sellerOrders = sellerOrders.filter((order) => {
        return (
          String(order.status || "").toUpperCase() === status.toUpperCase()
        );
      });
    }

    //==================================================
    // COURIER FILTER
    //==================================================

    if (courier) {
      const courierKeyword = courier.toLowerCase();

      sellerOrders = sellerOrders.filter((order) => {
        const courierName = String(order.shipment?.courier || "").toLowerCase();

        return courierName === courierKeyword;
      });
    }

    //==================================================
    // PAYMENT STATUS FILTER
    //==================================================

    if (paymentStatus) {
      const paymentStatusKeyword = paymentStatus.toUpperCase();

      sellerOrders = sellerOrders.filter((order) => {
        const currentPaymentStatus = String(
          order.payment?.status || "",
        ).toUpperCase();

        return currentPaymentStatus === paymentStatusKeyword;
      });
    }

    //==================================================
    // DATE FILTER
    //==================================================

    if (date) {
      sellerOrders = sellerOrders.filter((order) => {
        if (!order.createdAt) {
          return false;
        }

        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];

        return orderDate === date;
      });
    }

    //==================================================
    // SORT
    //==================================================

    sellerOrders.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    //==================================================
    // PAGINATION
    //==================================================

    const pageNumber = Math.max(page, 1);

    const limitNumber = Math.min(Math.max(limit, 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const total = sellerOrders.length;

    const paginatedOrders = sellerOrders.slice(skip, skip + limitNumber);

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(200).json({
      success: true,

      count: paginatedOrders.length,

      orders: paginatedOrders,

      pagination: {
        page: pageNumber,

        limit: limitNumber,

        total,

        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error(
      "[SELLER] GET SELLER ORDERS ERROR:",
      error.response?.data || error.message,
    );

    //------------------------------------------
    // Order Service Error
    //------------------------------------------

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    //------------------------------------------
    // Timeout
    //------------------------------------------

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return res.status(504).json({
        success: false,

        message: "Service request timeout",
      });
    }

    //------------------------------------------
    // Service Unavailable
    //------------------------------------------

    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      return res.status(503).json({
        success: false,

        message: "Required service unavailable",
      });
    }

    //------------------------------------------
    // Unknown Error
    //------------------------------------------

    return res.status(500).json({
      success: false,

      message: "Unable to fetch seller orders",
    });
  }
};

export const getSellerOrderStats = async (req, res) => {
  try {
    const sellerId = req.seller?._id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication required",
      });
    }

    //==================================================
    // DATE RANGE
    //==================================================

    const now = new Date();

    const currentPeriodStart = new Date(now);

    currentPeriodStart.setDate(currentPeriodStart.getDate() - 7);

    const previousPeriodStart = new Date(currentPeriodStart);

    previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);

    //==================================================
    // ORDER SERVICE
    //==================================================

    const orderResponse = await axios.post(
      `${process.env.ORDER_SERVICE_URL}/internal/seller/order-stats`,

      {
        sellerId: sellerId.toString(),
      },

      {
        headers: {
          Authorization: req.headers.authorization || "",
        },

        timeout: 10000,
      },
    );

    console.log(orderResponse.data);

    //==================================================
    // DATA FROM ORDER SERVICE
    //==================================================

    const orders = orderResponse.data?.orders || [];

    //==================================================
    // CURRENT PERIOD
    //==================================================

    const currentOrders = orders.filter((order) => {
      if (!order.createdAt) {
        return false;
      }

      const createdAt = new Date(order.createdAt);

      return createdAt >= currentPeriodStart;
    });

    //==================================================
    // PREVIOUS PERIOD
    //==================================================

    const previousOrders = orders.filter((order) => {
      if (!order.createdAt) {
        return false;
      }

      const createdAt = new Date(order.createdAt);

      return createdAt >= previousPeriodStart && createdAt < currentPeriodStart;
    });

    //==================================================
    // STATUS COUNTER
    //==================================================

    const countStatus = (orderList, status) => {
      return orderList.filter(
        (order) => String(order.status || "").toUpperCase() === status,
      ).length;
    };

    //==================================================
    // CURRENT STATS
    //==================================================

    const totalOrders = currentOrders.length;

    const pending =
      countStatus(currentOrders, "PENDING") ||
      countStatus(currentOrders, "PLACED");

    const confirmed = countStatus(currentOrders, "CONFIRMED");

    const packed = countStatus(currentOrders, "PACKED");

    const readyToShip = countStatus(currentOrders, "READY_TO_SHIP");

    const shipped = countStatus(currentOrders, "SHIPPED");

    const cancelled = countStatus(currentOrders, "CANCELLED");

    //==================================================
    // RETURNS
    //==================================================

    const returns = currentOrders.filter((order) => {
      const items = order.items || [];

      return items.some((item) =>
        ["RETURN_REQUESTED", "RETURNED"].includes(
          String(item.status || "").toUpperCase(),
        ),
      );
    }).length;

    //==================================================
    // PREVIOUS STATS
    //==================================================

    const previousTotalOrders = previousOrders.length;

    const previousPending =
      countStatus(previousOrders, "PENDING") ||
      countStatus(previousOrders, "PLACED");

    const previousConfirmed = countStatus(previousOrders, "CONFIRMED");

    const previousPacked = countStatus(previousOrders, "PACKED");

    const previousReadyToShip = countStatus(previousOrders, "READY_TO_SHIP");

    const previousShipped = countStatus(previousOrders, "SHIPPED");

    const previousCancelled = countStatus(previousOrders, "CANCELLED");

    const previousReturns = previousOrders.filter((order) => {
      const items = order.items || [];

      return items.some((item) =>
        ["RETURN_REQUESTED", "RETURNED"].includes(
          String(item.status || "").toUpperCase(),
        ),
      );
    }).length;

    //==================================================
    // PERCENTAGE CALCULATOR
    //==================================================

    const calculateChange = (current, previous) => {
      if (previous === 0) {
        if (current === 0) {
          return 0;
        }

        return 100;
      }

      return Math.round(((current - previous) / previous) * 100);
    };

    //==================================================
    // FINAL STATS
    //==================================================

    // const stats = {

    //     totalOrders: {
    //         count:
    //             totalOrders,

    //         change:
    //             calculateChange(
    //                 totalOrders,
    //                 previousTotalOrders
    //             ),
    //     },

    //     pending: {
    //         count:
    //             pending,

    //         change:
    //             calculateChange(
    //                 pending,
    //                 previousPending
    //             ),
    //     },

    //     confirmed: {
    //         count:
    //             confirmed,

    //         change:
    //             calculateChange(
    //                 confirmed,
    //                 previousConfirmed
    //             ),
    //     },

    //     packed: {
    //         count:
    //             packed,

    //         change:
    //             calculateChange(
    //                 packed,
    //                 previousPacked
    //             ),
    //     },

    //     readyToShip: {
    //         count:
    //             readyToShip,

    //         change:
    //             calculateChange(
    //                 readyToShip,
    //                 previousReadyToShip
    //             ),
    //     },

    //     shipped: {
    //         count:
    //             shipped,

    //         change:
    //             calculateChange(
    //                 shipped,
    //                 previousShipped
    //             ),
    //     },

    //     returns: {
    //         count:
    //             returns,

    //         change:
    //             calculateChange(
    //                 returns,
    //                 previousReturns
    //             ),
    //     },

    //     cancelled: {
    //         count:
    //             cancelled,

    //         change:
    //             calculateChange(
    //                 cancelled,
    //                 previousCancelled
    //             ),
    //     },

    // };

    const stats = {
      total: totalOrders,

      pending,

      confirmed,

      packed,

      readyToShip,

      shipped,

      returns,

      cancelled,

      changes: {
        total: calculateChange(totalOrders, previousTotalOrders),

        pending: calculateChange(pending, previousPending),

        confirmed: calculateChange(confirmed, previousConfirmed),

        packed: calculateChange(packed, previousPacked),

        readyToShip: calculateChange(readyToShip, previousReadyToShip),

        shipped: calculateChange(shipped, previousShipped),

        returns: calculateChange(returns, previousReturns),

        cancelled: calculateChange(cancelled, previousCancelled),
      },
    };

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(200).json({
      success: true,

      stats,

      period: {
        current: "LAST_7_DAYS",
        previous: "PREVIOUS_7_DAYS",
      },
    });
  } catch (error) {
    console.error(
      "[SELLER] GET ORDER STATS ERROR:",
      error.response?.data || error.message,
    );

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return res.status(504).json({
        success: false,

        message: "Order service timeout",
      });
    }

    return res.status(500).json({
      success: false,

      message: "Unable to fetch order statistics",
    });
  }
};

export const getSellerOrderById = async (req, res) => {
  try {
    const sellerId = req.seller?._id;
    const { orderId } = req.params;

    //-----------------------------------------
    // Validation
    //-----------------------------------------

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication required",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    //-----------------------------------------
    // Order Service
    //-----------------------------------------

    const response = await axios.post(
      `${process.env.ORDER_SERVICE_URL}/internal/seller/order/${orderId}`,
      {
        sellerId: sellerId.toString(),
      },
      {
        headers: {
          Authorization: req.headers.authorization || "",
        },

        timeout: 10000,
      },
    );

    //-----------------------------------------
    // Response
    //-----------------------------------------

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[SELLER] GET SELLER ORDER ERROR:",
      error.response?.data || error.message,
    );

    //-----------------------------------------
    // Order Service Error
    //-----------------------------------------

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    //-----------------------------------------
    // Timeout
    //-----------------------------------------

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "Order Service timeout",
      });
    }

    //-----------------------------------------
    // Service unavailable
    //-----------------------------------------

    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      return res.status(503).json({
        success: false,
        message: "Order Service unavailable",
      });
    }

    //-----------------------------------------
    // Unknown Error
    //-----------------------------------------

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order",
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
    // Order Service
    //------------------------------------

    const orderResponse = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/internal/orders/${orderId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },

        params: {
          sellerId: sellerId.toString(),
        },

        timeout: 10000,
      },
    );

    if (!orderResponse.data.success) {
      await mongoSession.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderResponse.data.order;

    //------------------------------------
    // Seller
    // Seller model belongs to Seller Service
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

    //------------------------------------
    // Shipment Number
    //------------------------------------

    const shipmentNumber = generateShipmentNumber();

    //------------------------------------
    // Tracking Number
    //------------------------------------

    const trackingNumber = generateTrackingNumber();

    //------------------------------------
    // Shipment Data
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

    const invoice = await generateInvoice(shipment, seller, order);

    //------------------------------------
    // Packing Slip PDF
    //------------------------------------

    const packingSlip = await generatePackingSlip(shipment, seller, order);

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

    //------------------------------------
    // Save Shipment
    //------------------------------------

    await shipment.save({
      session: mongoSession,
    });

    //------------------------------------
    // Update Order
    //------------------------------------

    await axios.patch(
      `${process.env.ORDER_SERVICE_URL}/internal/orders/${order._id}/seller-items/packed`,

      {
        sellerId: sellerId.toString(),
      },

      {
        headers: {
          Authorization: req.headers.authorization,
        },

        timeout: 10000,
      },
    );

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

    console.error(
      "GENERATE SHIPMENT ERROR:",
      error.response?.data || error.message,
    );

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

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
    //------------------------------------
    // Params
    //------------------------------------

    const { shipmentId } = req.params;

    //------------------------------------
    // Validate Shipment ID
    //------------------------------------

    if (!shipmentId) {
      return res.status(400).json({
        success: false,
        message: "Shipment ID is required.",
      });
    }

    //------------------------------------
    // Get Shipment
    //------------------------------------

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });
    }

    //------------------------------------
    // Check Shipment Status
    //------------------------------------

    if (shipment.status !== "LABEL_GENERATED") {
      return res.status(400).json({
        success: false,
        message: "Shipment label is not generated.",
      });
    }

    //------------------------------------
    // Update Shipment
    //------------------------------------

    shipment.status = "READY_TO_SHIP";

    shipment.logs.push({
      status: "READY_TO_SHIP",
      location: "Seller Warehouse",
      description: "Shipment packed and ready to ship.",
      updatedBy: "SELLER",
    });

    await shipment.save();

    //------------------------------------
    // Update Order Through Order Service
    //------------------------------------

    try {
      const response = await axios.patch(
        `${process.env.ORDER_SERVICE_URL}/internal/orders/${shipment.order}/status`,
        {
          status: "PACKED",
        },
        {
          headers: {
            Authorization: req.headers.authorization || "",
          },
          timeout: 10000,
        },
      );

      console.log("[SELLER] ORDER SERVICE RESPONSE:", response.data);
    } catch (orderError) {
      console.error(
        "[SELLER] ORDER SERVICE ERROR:",
        orderError.response?.data || orderError.message,
      );

      /*
       * Shipment already changed.
       * If Order Service fails, return error so frontend
       * knows that order update was not completed.
       */

      return res.status(502).json({
        success: false,
        message: "Shipment updated but order status update failed.",
        shipment,
        orderServiceError:
          orderError.response?.data?.message || orderError.message,
      });
    }

    //------------------------------------
    // Response
    //------------------------------------

    return res.status(200).json({
      success: true,
      message: "Shipment is ready to ship.",
      shipment,
    });
  } catch (error) {
    console.error("[SELLER] MARK READY TO SHIP ERROR:", error);

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
    //------------------------------------
    // Shipment ID
    //------------------------------------

    const { shipmentId } = req.params;

    if (!shipmentId) {
      return res.status(400).json({
        success: false,
        message: "Shipment ID is required.",
      });
    }

    //------------------------------------
    // Get Shipment
    //------------------------------------

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });
    }

    //------------------------------------
    // Check Status
    //------------------------------------

    if (shipment.status !== "PICKUP_SCHEDULED") {
      return res.status(400).json({
        success: false,
        message: "Pickup is not scheduled.",
      });
    }

    //------------------------------------
    // Update Shipment
    //------------------------------------

    shipment.status = "PICKED_UP";

    shipment.shippedAt = new Date();

    shipment.logs.push({
      status: "PICKED_UP",
      location: "Seller Warehouse",
      description: "Courier picked up shipment.",
      updatedBy: "COURIER",
    });

    await shipment.save();

    //------------------------------------
    // Update Order Through Order Service
    //------------------------------------

    try {
      const response = await axios.patch(
        `${process.env.ORDER_SERVICE_URL}/internal/orders/${shipment.order}/status`,
        {
          status: "SHIPPED",
        },
        {
          headers: {
            Authorization: req.headers.authorization || "",
          },
          timeout: 10000,
        },
      );

      console.log("[SELLER] ORDER SERVICE RESPONSE:", response.data);
    } catch (orderError) {
      console.error(
        "[SELLER] ORDER SERVICE ERROR:",
        orderError.response?.data || orderError.message,
      );

      return res.status(502).json({
        success: false,
        message: "Shipment picked up but order status update failed.",

        shipment,

        orderServiceError:
          orderError.response?.data?.message || orderError.message,
      });
    }

    //------------------------------------
    // Response
    //------------------------------------

    return res.status(200).json({
      success: true,
      message: "Shipment picked up.",
      shipment,
    });
  } catch (error) {
    console.error("[SELLER] MARK PICKED UP ERROR:", error);

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
    //------------------------------------
    // Shipment ID
    //------------------------------------

    const { shipmentId } = req.params;

    if (!shipmentId) {
      return res.status(400).json({
        success: false,
        message: "Shipment ID is required.",
      });
    }

    //------------------------------------
    // Get Shipment
    //------------------------------------

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });
    }

    //------------------------------------
    // Validate Status
    //------------------------------------

    if (shipment.status !== "SHIPPED") {
      return res.status(400).json({
        success: false,
        message: "Shipment is not in shipped status.",
      });
    }

    //------------------------------------
    // Update Shipment
    //------------------------------------

    shipment.status = "DELIVERED";

    shipment.deliveredAt = new Date();

    shipment.logs.push({
      status: "DELIVERED",

      location: shipment.shippingAddress?.city || "Unknown",

      description: "Shipment delivered successfully.",

      updatedBy: "COURIER",
    });

    await shipment.save();

    //------------------------------------
    // Update Order Through Order Service
    //------------------------------------

    try {
      const response = await axios.patch(
        `${process.env.ORDER_SERVICE_URL}/internal/orders/${shipment.order}/status`,
        {
          status: "DELIVERED",
        },
        {
          headers: {
            Authorization: req.headers.authorization || "",
          },

          timeout: 10000,
        },
      );

      console.log("[SELLER] ORDER SERVICE RESPONSE:", response.data);
    } catch (orderError) {
      console.error(
        "[SELLER] ORDER SERVICE ERROR:",
        orderError.response?.data || orderError.message,
      );

      return res.status(502).json({
        success: false,

        message: "Shipment delivered but order status update failed.",

        shipment,

        orderServiceError:
          orderError.response?.data?.message || orderError.message,
      });
    }

    //------------------------------------
    // Response
    //------------------------------------

    return res.status(200).json({
      success: true,

      message: "Shipment delivered successfully.",

      shipment,
    });
  } catch (error) {
    console.error("[SELLER] MARK DELIVERED ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
