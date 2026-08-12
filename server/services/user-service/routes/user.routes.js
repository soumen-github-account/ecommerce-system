// srvices/routes/auth.route.js

import express from "express"
import { addToCart, createAddress, createWishList, deleteAddress, getAddressById, getCartItems, getUser, getUserAddresses, getWishlist, removeFromCart, removeWishlist, setDefaultAddress, updateAddress, updateCartQuantity } from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getCart } from "../controllers/cart.controller.js";
import { getOrCreateFirebaseUser, getUserByIdInternal, getUserInternal } from "../controllers/authUser.controller.js";

const router = express.Router();

// User
router.get("/me", protect, getUser);

// Address
router.post("/addresses", protect, createAddress);
router.get("/addresses", protect, getUserAddresses);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);

// Wishlist
router.post("/wishlist", protect, createWishList);
router.delete("/wishlist", protect, removeWishlist);
router.get("/wishlist", protect, getWishlist);
router.patch(
  "/addresses/:addressId/default",
  protect,
  setDefaultAddress
);

// cart
router.post("/cart", protect, addToCart);
router.get("/cart", protect, getCartItems);
router.delete("/removeCartItem", protect, removeFromCart);
router.put("/cart-update-quantity", protect, updateCartQuantity)

router.get("/get-cart", protect, getCart);

router.get(
  "/get-address/:addressId",
  protect,
  getAddressById
);

router.post(
  "/auth/firebase-user",
  getOrCreateFirebaseUser
);
router.get(
    "/internal/:id",
    getUserByIdInternal
);

router.get(
    "/internal/user/:userId",
    getUserInternal
);

export default router;
