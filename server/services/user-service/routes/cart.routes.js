import express from "express";
import { getCartForCheckout } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/checkout", protect, getCartForCheckout);

export default router;