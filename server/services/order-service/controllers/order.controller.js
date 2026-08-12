import axios from "axios";
import { Order } from "../models/OrderModel.js";

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({ createdAt: -1 }).lean();

    console.log(orders)

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        orders: [],
      });
    }

    // ==========================================
    // Product Service ke liye request prepare
    // ==========================================

    const items = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        items.push({
          orderId: order._id,
          productId: item.product,
          variantId: item.variant,
        });
      });
    });

    // ==========================================
    // Product Service Call
    // ==========================================

    const response = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/order-products`,
      { items },
    );

    const products = response.data.orderItems || [];

    // ==========================================
    // Merge Product Data
    // ==========================================

    const formattedOrders = orders.map((order) => {
      const orderItems = order.items.map((item) => {
        const product = products.find(
          (p) =>
            p.productId.toString() === item.product.toString() &&
            p.variantId.toString() === item.variant.toString(),
        );

        return {
          ...item,

          product: product
            ? {
                _id: product.productId,
                title: product.title,
                slug: product.slug,
                brand: product.brand,
                category: product.category,
                subCategory: product.subCategory,
                subCategoryLevel2: product.subCategoryLevel2,
              }
            : null,

          variant: product
            ? {
                _id: product.variantId,
                variantName: product.variantName,
                attributes: product.attributes,
                pricing: product.pricing,
                inventory: product.inventory,
                images: [
                  {
                    url: product.image,
                    isPrimary: true,
                  },
                ],
              }
            : null,
        };
      });

      return {
        ...order,
        items: orderItems,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // Product Service Request
    // ==========================================

    const items = order.items.map((item) => ({
      productId: item.product,
      variantId: item.variant,
    }));

    const response = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/order-products`,
      {
        items,
      },
    );

    const products = response.data.orderItems || [];

    // ==========================================
    // Merge Product Data
    // ==========================================

    const formattedItems = order.items.map((item) => {
      const product = products.find(
        (p) =>
          p.productId.toString() === item.product.toString() &&
          p.variantId.toString() === item.variant.toString(),
      );

      return {
        ...item,

        product: product
          ? {
              _id: product.productId,
              title: product.title,
              slug: product.slug,
              brand: product.brand,
              category: product.category,
              subCategory: product.subCategory,
              subCategoryLevel2: product.subCategoryLevel2,
              highlights: product.highlights,
            }
          : null,

        variant: product
          ? {
              _id: product.variantId,
              variantName: product.variantName,
              attributes: product.attributes,
              pricing: product.pricing,
              inventory: product.inventory,
              images: [
                {
                  url: product.image,
                  isPrimary: true,
                },
              ],
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      order: {
        ...order,
        items: formattedItems,
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

export const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const steps = [
      {
        key: "PLACED",
        title: "Order Placed",
        description: "Your order has been placed successfully.",
      },
      {
        key: "CONFIRMED",
        title: "Order Confirmed",
        description: "Seller has confirmed your order.",
      },
      {
        key: "PACKED",
        title: "Packed",
        description: "Your package has been packed.",
      },
      {
        key: "SHIPPED",
        title: "Shipped",
        description: "Your package has been shipped.",
      },
      {
        key: "OUT_FOR_DELIVERY",
        title: "Out For Delivery",
        description: "Your package is out for delivery.",
      },
      {
        key: "DELIVERED",
        title: "Delivered",
        description: "Order delivered successfully.",
      },
    ];

    const currentIndex = steps.findIndex((step) => step.key === order.status);

    const tracking = steps.map((step, index) => ({
      status: step.key,
      title: step.title,
      description: step.description,
      completed: index <= currentIndex,
      date: index <= currentIndex ? order.updatedAt : null,
    }));

    return res.status(200).json({
      success: true,
      tracking,
      currentStatus: order.status,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createInternalOrder = async (req, res) => {
  try {

    const {
      userId,
      orderItems,
      shippingAddress,
      pricing,
      payment,
      status,
    } = req.body;

    // ==========================================
    // Validate
    // ==========================================

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!pricing) {
      return res.status(400).json({
        success: false,
        message: "Pricing is required",
      });
    }

    // ==========================================
    // Order Number
    // ==========================================

    const orderNumber =
      "CB" +
      Date.now() +
      Math.floor(Math.random() * 1000);

    // ==========================================
    // Create Order
    // ==========================================

    const order = await Order.create({

      orderNumber,

      user: userId,

      items: orderItems,

      shippingAddress,

      pricing,

      payment: {
        method:
          payment?.method || "COD",

        status:
          payment?.status || "PENDING",
      },

      status:
        status || "PLACED",
    });

    // ==========================================
    // Response
    // ==========================================

    return res.status(201).json({
      success: true,

      orderId: order._id,

      orderNumber:
        order.orderNumber,

      totalAmount:
        order.pricing.totalAmount,
    });

  } catch (error) {

    console.error(
      "ORDER SERVICE CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInternalOrder = async (req, res) => {

    try {

        const order = await Order.findById(
            req.params.id
        ).lean();

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }

        return res.status(200).json({

            success: true,

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const updateOrderPayment = async (req, res) => {

    try {

        const {
            paymentMethod
        } = req.body;

        if (!paymentMethod) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment method is required"

            });

        }

        const order = await Order.findById(
            req.params.id
        );

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }

        if (
            order.user.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized order"

            });

        }

        order.payment.method =
            paymentMethod.toUpperCase();

        await order.save();

        return res.status(200).json({

            success: true,

            message:
                "Payment method updated",

            orderId: order._id

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

