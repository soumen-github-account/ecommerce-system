
import express from "express"
import { protect } from "../middlewares/authMiddleware.js";
import { addToCart, checkout, createAddress, createWishList, deleteAddress, getCartItems, getMyOrders, getOrderById, getOrderTracking, getUser, getUserAddresses, getWishlist, removeFromCart, removeWishlist, setDefaultAddress, updateAddress, updateCartQuantity } from "../controllers/userController.js";

const router = express.Router();

// User
router.get("/me", protect, getUser);

// Wishlist
router.post("/wishlist", protect, createWishList);
router.delete("/wishlist", protect, removeWishlist);
router.get("/wishlist", protect, getWishlist);

// Cart
router.post("/cart", protect, addToCart);
router.get("/cart", protect, getCartItems);
router.delete("/removeCartItem", protect, removeFromCart);
router.put("/cart-update-quantity", protect, updateCartQuantity)

// Address
router.post("/addresses", protect, createAddress);
router.get("/addresses", protect, getUserAddresses);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);
router.patch(
  "/addresses/:addressId/default",
  protect,
  setDefaultAddress
);

// Orders
router.post("/checkout", protect, checkout);
router.get("/orders", protect, getMyOrders);
router.get("/orders/:id", protect, getOrderById);
router.get("/orders/:id/tracking", protect, getOrderTracking);

export default router