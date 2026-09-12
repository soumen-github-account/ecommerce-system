import { Cart } from "../models/CartModel.js";

// =====================================================
// CLEAR CART - INTERNAL SERVICE
// =====================================================

export const clearCartInternal = async (req, res) => {
  try {
    const { userId, orderId } = req.body;

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // -----------------------------------------
    // DELETE USER CART
    // -----------------------------------------

    const result = await Cart.deleteMany({
      user: userId,
    });

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      userId,
      orderId: orderId || null,
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    console.error(
      "[USER SERVICE] clearCartInternal ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};