import mongoose from "mongoose";
import { Order } from "../models/OrderModel.js";
import axios from "axios";
import { Shipment } from "../models/ShipmentModel.js";

export const getSellerOrdersInternal = async (req, res) => {
  try {
    //------------------------------------------
    // Seller ID
    //------------------------------------------

    const sellerId =
      typeof req.body.sellerId === "string" ? req.body.sellerId.trim() : "";

    //------------------------------------------
    // Validate Seller
    //------------------------------------------

    if (!sellerId) {
      return res.status(400).json({
        success: false,

        message: "Seller ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,

        message: "Invalid seller ID",
      });
    }

    //------------------------------------------
    // Seller Object ID
    //------------------------------------------

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    //==================================================
    // FIND ORDERS
    //==================================================

    let orders = await Order.find({
      "items.seller": sellerObjectId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    //==================================================
    // KEEP SELLER ITEMS ONLY
    //==================================================

    orders = orders
      .map((order) => {
        const sellerItems = (order.items || []).filter((item) => {
          if (!item.seller) {
            return false;
          }

          return item.seller.toString() === sellerId;
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

          // ONLY USER ID
          user: order.user,

          items: sellerItems,
        };
      })
      .filter((order) => order.items.length > 0);

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(200).json({
      success: true,

      orders,
    });
  } catch (error) {
    console.error("[ORDER] GET SELLER ORDERS INTERNAL ERROR:", error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getSellerOrderByIdInternal = async (req, res) => {
  try {
    const { orderId } = req.params;

    const sellerId =
      typeof req.body.sellerId === "string" ? req.body.sellerId.trim() : "";

    //-----------------------------------------
    // Validation
    //-----------------------------------------

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID",
      });
    }

    //-----------------------------------------
    // Find Order
    //-----------------------------------------

    const order = await Order.findOne({
      _id: orderId,
      "items.seller": new mongoose.Types.ObjectId(sellerId),
    }).lean();

    //-----------------------------------------
    // Order Not Found
    //-----------------------------------------

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    //-----------------------------------------
    // Seller Items
    //-----------------------------------------

    const sellerItems = (order.items || []).filter(
      (item) => item.seller?.toString() === sellerId.toString(),
    );

    if (!sellerItems.length) {
      return res.status(404).json({
        success: false,
        message: "No items found for this seller",
      });
    }

    //-----------------------------------------
    // Product IDs
    //-----------------------------------------

    const productItems = sellerItems.map((item) => ({
      productId: item.product,
      variantId: item.variant,
    }));

    //-----------------------------------------
    // Product Service
    //-----------------------------------------

    let products = [];

    try {
      const productResponse = await axios.post(
        `${process.env.PRODUCT_SERVICE_URL}/products/internal/order-products`,
        {
          items: productItems,
        },
        {
          timeout: 10000,
        },
      );

      if (productResponse.data?.success) {
        products = productResponse.data.orderItems || [];
      }
    } catch (error) {
      console.error(
        "[ORDER] PRODUCT SERVICE ERROR:",
        error.response?.data || error.message,
      );

      return res.status(503).json({
        success: false,
        message: "Unable to fetch product details",
      });
    }

    //-----------------------------------------
    // Merge Product Data
    //-----------------------------------------

    const formattedItems = sellerItems.map((item) => {
      const product = products.find(
        (product) =>
          product.productId?.toString() === item.product?.toString() &&
          product.variantId?.toString() === item.variant?.toString(),
      );

      return {
        ...item,

        product: product
          ? {
              _id: product.productId,

              title: product.title,

              brand: product.brand,

              slug: product.slug,

              manufacturer: product.manufacturer,

              countryOfOrigin: product.countryOfOrigin,
            }
          : null,

        variant: product
          ? {
              _id: product.variantId,

              variantName: product.variantName,

              sku: product.sku,

              barcode: product.barcode,

              images: product.images || [],

              pricing: product.pricing,

              inventory: product.inventory,

              shipping: product.shipping,
            }
          : null,
      };
    });

    //-----------------------------------------
    // Shipment
    //-----------------------------------------

    /*
     * IMPORTANT:
     *
     * Agar Shipment model bhi Seller Service se
     * hata kar kisi dedicated service me rakhna
     * chahte ho, yahan us service ko call karna.
     *
     * Abhi shipment data Order Service me nahi hai,
     * isliye null rakha hai.
     */

    let shipment = null;

    //-----------------------------------------
    // Response
    //-----------------------------------------

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

        userId: order.user,

        items: formattedItems,

        shipment,
      },
    });
  } catch (error) {
    console.error("[ORDER] GET SELLER ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderForSellerInternal = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { sellerId } = req.query;

    //------------------------------------
    // Validate
    //------------------------------------

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order Id is required",
      });
    }

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller Id is required",
      });
    }

    //------------------------------------
    // Find Order
    //------------------------------------

    const order = await Order.findOne({
      _id: orderId,
      "items.seller": sellerId,
    }).lean();

    //------------------------------------
    // Order Not Found
    //------------------------------------

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    //------------------------------------
    // Seller Items
    //------------------------------------

    const sellerItems = order.items.filter(
      (item) => item.seller.toString() === sellerId.toString(),
    );

    //------------------------------------
    // Safety Check
    //------------------------------------

    if (sellerItems.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Seller is not authorized for this order",
      });
    }

    //------------------------------------
    // Response
    //------------------------------------

    return res.status(200).json({
      success: true,

      order: {
        ...order,

        items: sellerItems,
      },
    });
  } catch (error) {
    console.error("GET ORDER FOR SELLER INTERNAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markSellerItemsPackedInternal = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { sellerId } = req.body;

    //------------------------------------
    // Validate
    //------------------------------------

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order Id is required",
      });
    }

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller Id is required",
      });
    }

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
    // Update Seller Items
    //------------------------------------

    let updated = false;

    order.items.forEach((item) => {
      if (
        item.seller.toString() === sellerId.toString() &&
        item.status !== "PACKED"
      ) {
        item.status = "PACKED";
        updated = true;
      }
    });

    //------------------------------------
    // Nothing Updated
    //------------------------------------

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Seller items are already packed",
      });
    }

    //------------------------------------
    // Check All Items
    //------------------------------------

    const allPacked = order.items.every((item) => item.status === "PACKED");

    if (allPacked) {
      order.status = "PACKED";
    }

    //------------------------------------
    // Save Order
    //------------------------------------

    await order.save();

    //------------------------------------
    // Response
    //------------------------------------

    return res.status(200).json({
      success: true,

      message: "Seller items marked as packed",

      orderStatus: order.status,
    });
  } catch (error) {
    console.error("MARK SELLER ITEMS PACKED ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatusInternal = async (req, res) => {
  try {
    //------------------------------------
    // Params
    //------------------------------------

    const { orderId } = req.params;

    const { status } = req.body;

    //------------------------------------
    // Validation
    //------------------------------------

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required.",
      });
    }

    //------------------------------------
    // Find Order
    //------------------------------------

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    //------------------------------------
    // Update Status
    //------------------------------------

    order.status = status;

    await order.save();

    //------------------------------------
    // Response
    //------------------------------------

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("[ORDER] UPDATE ORDER STATUS INTERNAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSellerOrderStatsInternal = async (req, res) => {
  try {
    //==================================================
    // SELLER ID
    //==================================================

    const sellerId =
      typeof req.body.sellerId === "string" ? req.body.sellerId.trim() : "";

    if (!sellerId) {
      return res.status(400).json({
        success: false,

        message: "Seller ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,

        message: "Invalid seller ID",
      });
    }

    //==================================================
    // GET SELLER ORDERS
    //==================================================

    const orders = await Order.find({
      "items.seller": new mongoose.Types.ObjectId(sellerId),
    })
      .select("_id orderNumber status createdAt items.status")
      .sort({
        createdAt: -1,
      })
      .lean();

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(200).json({
      success: true,

      orders,
    });
  } catch (error) {
    console.error("[ORDER] SELLER ORDER STATS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getSellerDashboardData = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const { from, to, previousFrom, previousTo } = req.query;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID",
      });
    }

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    const currentFrom = from
      ? new Date(from)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const currentTo = to ? new Date(to) : new Date();

    const prevFrom = previousFrom
      ? new Date(previousFrom)
      : new Date(
          currentFrom.getTime() - (currentTo.getTime() - currentFrom.getTime()),
        );

    const prevTo = previousTo ? new Date(previousTo) : new Date(currentFrom);

    /**
     * ==========================================
     * COMMON MATCH
     * ==========================================
     *
     * Seller can be stored:
     *
     * items.seller
     *
     * because one order can contain products
     * from multiple sellers.
     */

    const buildMatch = (startDate, endDate) => ({
      "items.seller": sellerObjectId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    /**
     * ==========================================
     * CURRENT SUMMARY
     * ==========================================
     */

    const currentSummary = await Order.aggregate([
      {
        $match: buildMatch(currentFrom, currentTo),
      },

      {
        $unwind: "$items",
      },

      {
        $match: {
          "items.seller": sellerObjectId,
        },
      },

      {
        $group: {
          _id: null,

          /**
           * Unique orders
           */
          totalOrders: {
            $addToSet: "$_id",
          },

          /**
           * Revenue
           *
           * Only count non-cancelled items.
           */
          revenue: {
            $sum: {
              $cond: [
                {
                  $not: {
                    $in: ["$items.status", ["CANCELLED", "RETURNED"]],
                  },
                },
                {
                  $ifNull: [
                    "$items.pricing.total",
                    {
                      $multiply: [
                        {
                          $ifNull: ["$items.pricing.sellingPrice", 0],
                        },
                        "$items.quantity",
                      ],
                    },
                  ],
                },
                0,
              ],
            },
          },

          /**
           * Units actually sold
           */
          unitsSold: {
            $sum: {
              $cond: [
                {
                  $eq: ["$items.status", "DELIVERED"],
                },
                "$items.quantity",
                0,
              ],
            },
          },

          /**
           * Profit
           *
           * (selling price - cost price) * quantity
           */
          profit: {
            $sum: {
              $cond: [
                {
                  $eq: ["$items.status", "DELIVERED"],
                },
                {
                  $multiply: [
                    {
                      $subtract: [
                        {
                          $ifNull: ["$items.pricing.sellingPrice", 0],
                        },
                        {
                          $ifNull: ["$items.pricing.costPrice", 0],
                        },
                      ],
                    },
                    "$items.quantity",
                  ],
                },
                0,
              ],
            },
          },

          /**
           * Returns
           */
          returns: {
            $sum: {
              $cond: [
                {
                  $in: ["$items.status", ["RETURN_REQUESTED", "RETURNED"]],
                },
                "$items.quantity",
                0,
              ],
            },
          },

          /**
           * Cancelled
           */
          cancelled: {
            $sum: {
              $cond: [
                {
                  $eq: ["$items.status", "CANCELLED"],
                },
                "$items.quantity",
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          totalOrders: {
            $size: "$totalOrders",
          },
          revenue: 1,
          profit: 1,
          unitsSold: 1,
          returns: 1,
          cancelled: 1,
        },
      },
    ]);

    /**
     * ==========================================
     * PREVIOUS SUMMARY
     * ==========================================
     */

    const previousSummary = await Order.aggregate([
      {
        $match: buildMatch(prevFrom, prevTo),
      },

      {
        $unwind: "$items",
      },

      {
        $match: {
          "items.seller": sellerObjectId,
        },
      },

      {
        $group: {
          _id: null,

          totalOrders: {
            $addToSet: "$_id",
          },

          revenue: {
            $sum: {
              $cond: [
                {
                  $not: {
                    $in: ["$items.status", ["CANCELLED", "RETURNED"]],
                  },
                },
                {
                  $ifNull: [
                    "$items.pricing.total",
                    {
                      $multiply: [
                        {
                          $ifNull: ["$items.pricing.sellingPrice", 0],
                        },
                        "$items.quantity",
                      ],
                    },
                  ],
                },
                0,
              ],
            },
          },

          unitsSold: {
            $sum: {
              $cond: [
                {
                  $eq: ["$items.status", "DELIVERED"],
                },
                "$items.quantity",
                0,
              ],
            },
          },

          profit: {
            $sum: {
              $cond: [
                {
                  $eq: ["$items.status", "DELIVERED"],
                },
                {
                  $multiply: [
                    {
                      $subtract: [
                        {
                          $ifNull: ["$items.pricing.sellingPrice", 0],
                        },
                        {
                          $ifNull: ["$items.pricing.costPrice", 0],
                        },
                      ],
                    },
                    "$items.quantity",
                  ],
                },
                0,
              ],
            },
          },

          returns: {
            $sum: {
              $cond: [
                {
                  $in: ["$items.status", ["RETURN_REQUESTED", "RETURNED"]],
                },
                "$items.quantity",
                0,
              ],
            },
          },

          cancelled: {
            $sum: {
              $cond: [
                {
                  $eq: ["$items.status", "CANCELLED"],
                },
                "$items.quantity",
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          totalOrders: {
            $size: "$totalOrders",
          },
          revenue: 1,
          profit: 1,
          unitsSold: 1,
          returns: 1,
          cancelled: 1,
        },
      },
    ]);

    /**
     * ==========================================
     * ORDER STATUS
     * ==========================================
     */

    const orderStatus = await Order.aggregate([
      {
        $match: buildMatch(currentFrom, currentTo),
      },

      {
        $unwind: "$items",
      },

      {
        $match: {
          "items.seller": sellerObjectId,
        },
      },

      {
        $group: {
          _id: "$items.status",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    /**
     * ==========================================
     * RECENT ORDERS
     * ==========================================
     */

    const recentOrders = await Order.aggregate([
      {
        $match: {
          "items.seller": sellerObjectId,
        },
      },

      {
        $unwind: "$items",
      },

      {
        $match: {
          "items.seller": sellerObjectId,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $limit: 20,
      },

      {
        $project: {
          _id: 0,

          orderId: "$_id",

          orderNumber: 1,

          createdAt: 1,

          status: "$items.status",

          quantity: "$items.quantity",

          sku: "$items.sku",

          productId: "$items.product",

          variantId: "$items.variant",

          title: "$items.snapshot.title",

          variantName: "$items.snapshot.variantName",

          image: "$items.snapshot.image",

          amount: {
            $ifNull: [
              "$items.pricing.total",
              {
                $multiply: ["$items.pricing.sellingPrice", "$items.quantity"],
              },
            ],
          },
        },
      },
    ]);

    /**
     * ==========================================
     * TOP SELLING PRODUCTS
     * ==========================================
     */

    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          "items.seller": sellerObjectId,
          createdAt: {
            $gte: currentFrom,
            $lte: currentTo,
          },
        },
      },

      {
        $unwind: "$items",
      },

      {
        $match: {
          "items.seller": sellerObjectId,
          "items.status": "DELIVERED",
        },
      },

      {
        $group: {
          _id: "$items.product",

          unitsSold: {
            $sum: "$items.quantity",
          },

          revenue: {
            $sum: {
              $ifNull: [
                "$items.pricing.total",
                {
                  $multiply: ["$items.pricing.sellingPrice", "$items.quantity"],
                },
              ],
            },
          },

          title: {
            $first: "$items.snapshot.title",
          },

          image: {
            $first: "$items.snapshot.image",
          },
        },
      },

      {
        $sort: {
          unitsSold: -1,
        },
      },

      {
        $limit: 10,
      },

      {
        $project: {
          _id: 0,
          productId: "$_id",
          title: 1,
          image: 1,
          unitsSold: 1,
          revenue: 1,
        },
      },
    ]);

    /* =========================================================
    SALES OVERVIEW
    Daily revenue for selected period
    ========================================================= */

    const salesOverview = await Order.aggregate([
      {
        $match: {
          "items.seller": sellerObjectId,
          createdAt: {
            $gte: currentFrom,
            $lte: currentTo,
          },
        },
      },

      {
        $unwind: "$items",
      },

      {
        $match: {
          "items.seller": sellerObjectId,
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          revenue: {
            $sum: {
              $cond: [
                {
                  $not: {
                    $in: ["$items.status", ["CANCELLED", "RETURNED"]],
                  },
                },

                {
                  $ifNull: [
                    "$items.pricing.total",

                    {
                      $multiply: [
                        {
                          $ifNull: ["$items.pricing.sellingPrice", 0],
                        },

                        {
                          $ifNull: ["$items.quantity", 0],
                        },
                      ],
                    },
                  ],
                },

                0,
              ],
            },
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
        },
      },
    ]);

    /* =========================================================
    FILL EMPTY DAYS
    ========================================================= */

    const salesMap = new Map(
      salesOverview.map((item) => [item.date, Number(item.revenue || 0)]),
    );

    const salesChart = [];

    const cursor = new Date(currentFrom);

    while (cursor <= currentTo) {
      const year = cursor.getFullYear();
      const month = String(cursor.getMonth() + 1).padStart(2, "0");

      const day = String(cursor.getDate()).padStart(2, "0");

      const dateKey = `${year}-${month}-${day}`;

      salesChart.push({
        label: cursor.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),

        revenue: salesMap.get(dateKey) || 0,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return res.status(200).json({
      success: true,

      data: {
        current: currentSummary[0] || {
          totalOrders: 0,
          revenue: 0,
          profit: 0,
          unitsSold: 0,
          returns: 0,
          cancelled: 0,
        },

        previous: previousSummary[0] || {
          totalOrders: 0,
          revenue: 0,
          profit: 0,
          unitsSold: 0,
          returns: 0,
          cancelled: 0,
        },

        orderStatus,
        salesOverview: {
          chart: salesChart,
        },
        recentOrders,
        topSellingProducts,
      },
    });
  } catch (error) {
    console.error("Seller dashboard order service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch seller dashboard order data",
      error: error.message,
    });
  }
};

// =====================================================
// GET ORDER FOR INTERNAL SERVICE
// =====================================================

export const getOrderInternal = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).lean();

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    console.error("getOrderInternal:", error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// PAYMENT SUCCESS
// =====================================================

export const paymentSuccessInternal = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { transactionId, paymentProvider } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    // -----------------------------------------
    // IDEMPOTENCY
    // -----------------------------------------

    if (
      order.payment?.status === "SUCCESS" &&
      order.payment?.transactionId === transactionId
    ) {
      return res.status(200).json({
        success: true,

        message: "Order already confirmed",

        order,
      });
    }

    // -----------------------------------------
    // UPDATE PAYMENT
    // -----------------------------------------

    order.payment.status = "SUCCESS";

    order.payment.transactionId = transactionId;

    order.payment.paymentProvider = paymentProvider;

    // -----------------------------------------
    // ORDER STATUS
    // -----------------------------------------

    order.status = "CONFIRMED";

    await order.save();

    return res.status(200).json({
      success: true,

      message: "Order confirmed successfully",

      order,
    });
  } catch (error) {
    console.error("paymentSuccessInternal:", error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// PAYMENT FAILED
// =====================================================

export const paymentFailedInternal = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    order.payment.status = "FAILED";

    order.payment.failureReason = reason;

    order.status = "PAYMENT_FAILED";

    await order.save();

    return res.status(200).json({
      success: true,

      message: "Order payment marked failed",
    });
  } catch (error) {
    console.error("paymentFailedInternal:", error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
