import express from "express";
import sellerAuth from "../middlewares/sellerAuth.js";
import { sellerDashboardController } from "../controllers/sellerDashboardController.js";

const router = express.Router();


router.get(
    "/",
    sellerAuth,
    sellerDashboardController
);


export default router;