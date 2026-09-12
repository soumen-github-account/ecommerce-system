import express from "express";
import { internalServiceAuth } from "../middlewares/internalServiceAuth.js";
import { clearCartInternal } from "../controllers/internal.controller.js";


const router = express.Router();

router.delete(
  "/cart",
  internalServiceAuth,
  clearCartInternal
);

export default router;