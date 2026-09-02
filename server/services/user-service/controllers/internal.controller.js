import { Cart } from "../models/CartModel.js";

export const clearCartInternal = async (req, res) => {
  try {
    const { userId, orderId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,

        message: "userId is required",
      });
    }

    await Cart.deleteMany({
      user: userId,
    });

    return res.status(200).json({
      success: true,

      message: "Cart cleared successfully",

      userId,

      orderId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

