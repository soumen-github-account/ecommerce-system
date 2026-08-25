import mongoose from "mongoose";
import { Order } from "../models/OrderModel.js";
import axios from "axios"
import { Shipment } from "../models/ShipmentModel.js";

export const getSellerOrdersInternal = async (req, res) => {

    try {

        //------------------------------------------
        // Seller ID
        //------------------------------------------

        const sellerId =
            typeof req.body.sellerId === "string"
                ? req.body.sellerId.trim()
                : "";


        //------------------------------------------
        // Validate Seller
        //------------------------------------------

        if (!sellerId) {

            return res.status(400).json({

                success: false,

                message:
                    "Seller ID is required",

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                sellerId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid seller ID",

            });

        }


        //------------------------------------------
        // Seller Object ID
        //------------------------------------------

        const sellerObjectId =
            new mongoose.Types.ObjectId(
                sellerId
            );


        //==================================================
        // FIND ORDERS
        //==================================================

        let orders =
            await Order.find({

                "items.seller":
                    sellerObjectId,

            })
            .sort({

                createdAt: -1,

            })
            .lean();


        //==================================================
        // KEEP SELLER ITEMS ONLY
        //==================================================

        orders =
            orders
                .map((order) => {

                    const sellerItems =
                        (order.items || [])
                            .filter(
                                (item) => {

                                    if (!item.seller) {

                                        return false;

                                    }


                                    return (

                                        item.seller.toString() ===
                                        sellerId

                                    );

                                }
                            );


                    return {

                        _id:
                            order._id,

                        orderNumber:
                            order.orderNumber,

                        status:
                            order.status,

                        createdAt:
                            order.createdAt,

                        updatedAt:
                            order.updatedAt,

                        payment:
                            order.payment,

                        pricing:
                            order.pricing,

                        shippingAddress:
                            order.shippingAddress,

                        // ONLY USER ID
                        user:
                            order.user,

                        items:
                            sellerItems,

                    };

                })
                .filter(
                    (order) =>
                        order.items.length > 0
                );


        //==================================================
        // RESPONSE
        //==================================================

        return res.status(200).json({

            success: true,

            orders,

        });


    } catch (error) {

        console.error(
            "[ORDER] GET SELLER ORDERS INTERNAL ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};

export const getSellerOrderByIdInternal = async (req, res) => {

    try {

        const { orderId } = req.params;

        const sellerId =
            typeof req.body.sellerId === "string"
                ? req.body.sellerId.trim()
                : "";

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

        if (
            !mongoose.Types.ObjectId.isValid(orderId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(sellerId)
        ) {
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
            "items.seller":
                new mongoose.Types.ObjectId(sellerId),
        })
            .lean();

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

        const sellerItems =
            (order.items || []).filter(
                (item) =>
                    item.seller?.toString() ===
                    sellerId.toString()
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

        const productItems = sellerItems.map(
            (item) => ({
                productId: item.product,
                variantId: item.variant,
            })
        );

        //-----------------------------------------
        // Product Service
        //-----------------------------------------

        let products = [];

        try {

            const productResponse =
                await axios.post(
                    `${process.env.PRODUCT_SERVICE_URL}/products/internal/order-products`,
                    {
                        items: productItems,
                    },
                    {
                        timeout: 10000,
                    }
                );

            if (
                productResponse.data?.success
            ) {
                products =
                    productResponse.data.orderItems ||
                    [];
            }

        } catch (error) {

            console.error(
                "[ORDER] PRODUCT SERVICE ERROR:",
                error.response?.data ||
                error.message
            );

            return res.status(503).json({
                success: false,
                message:
                    "Unable to fetch product details",
            });
        }

        //-----------------------------------------
        // Merge Product Data
        //-----------------------------------------

        const formattedItems =
            sellerItems.map((item) => {

                const product =
                    products.find(
                        (product) =>
                            product.productId?.toString() ===
                                item.product?.toString() &&
                            product.variantId?.toString() ===
                                item.variant?.toString()
                    );

                return {
                    ...item,

                    product: product
                        ? {
                            _id:
                                product.productId,

                            title:
                                product.title,

                            brand:
                                product.brand,

                            slug:
                                product.slug,

                            manufacturer:
                                product.manufacturer,

                            countryOfOrigin:
                                product.countryOfOrigin,
                        }
                        : null,

                    variant: product
                        ? {
                            _id:
                                product.variantId,

                            variantName:
                                product.variantName,

                            sku:
                                product.sku,

                            barcode:
                                product.barcode,

                            images:
                                product.images || [],

                            pricing:
                                product.pricing,

                            inventory:
                                product.inventory,

                            shipping:
                                product.shipping,
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

                _id:
                    order._id,

                orderNumber:
                    order.orderNumber,

                status:
                    order.status,

                createdAt:
                    order.createdAt,

                updatedAt:
                    order.updatedAt,

                pricing:
                    order.pricing,

                payment:
                    order.payment,

                shippingAddress:
                    order.shippingAddress,

                userId:
                    order.user,

                items:
                    formattedItems,

                shipment,

            },

        });

    } catch (error) {

        console.error(
            "[ORDER] GET SELLER ORDER ERROR:",
            error
        );

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
            (item) =>
                item.seller.toString() ===
                sellerId.toString()
        );

        //------------------------------------
        // Safety Check
        //------------------------------------

        if (sellerItems.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "Seller is not authorized for this order",
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

        console.error(
            "GET ORDER FOR SELLER INTERNAL ERROR:",
            error
        );

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
        item.seller.toString() ===
          sellerId.toString()
        &&
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

    const allPacked = order.items.every(
      (item) => item.status === "PACKED"
    );

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

      message:
        "Seller items marked as packed",

      orderStatus:
        order.status,
    });

  } catch (error) {

    console.error(
      "MARK SELLER ITEMS PACKED ERROR:",
      error
    );

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
    console.error(
      "[ORDER] UPDATE ORDER STATUS INTERNAL ERROR:",
      error
    );

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
            typeof req.body.sellerId === "string"
                ? req.body.sellerId.trim()
                : "";


        if (!sellerId) {

            return res.status(400).json({

                success: false,

                message:
                    "Seller ID is required",

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                sellerId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid seller ID",

            });

        }


        //==================================================
        // GET SELLER ORDERS
        //==================================================

        const orders =
            await Order.find({

                "items.seller":
                    new mongoose.Types.ObjectId(
                        sellerId
                    ),

            })
            .select(
                "_id orderNumber status createdAt items.status"
            )
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

        console.error(
            "[ORDER] SELLER ORDER STATS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};

