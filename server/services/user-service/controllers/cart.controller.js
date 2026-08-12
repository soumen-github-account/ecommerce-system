import { Cart } from "../models/CartModel.js";

export const getCartForCheckout = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.find({
      user: userId,
    }).lean();

    if (!cartItems.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        cartItems: [],
      });
    }

    const items = cartItems.map((item) => ({
      cartId: item._id,
      productId: item.product,
      variantId: item.variant,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      count: items.length,
      cartItems: items,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getCart = async (req, res) => {
  try {

    const cart = await Cart.find({
      user: req.user.id,
    }).lean();

    return res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
