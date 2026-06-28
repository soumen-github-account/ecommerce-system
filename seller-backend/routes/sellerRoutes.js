import express from "express";
import { getSellerProfile, logoutSeller, sellerLogin, sellerRegister } from "../controllers/SellerRegisterFormController.js";
import sellerAuth from "../middlewares/sellerAuth.js";
import { uploadSellerDetails } from "../middlewares/sellerDetailsMulter.js";


const router = express.Router();

router.post("/register",

    uploadSellerDetails.fields([

        { name: "storeLogo", maxCount: 1 },

        { name: "aadhar", maxCount: 1 },

        { name: "panCard", maxCount: 1 },

        { name: "businessProof", maxCount: 1 }

    ]),

    sellerRegister

);

router.post("/login", sellerLogin);

router.post("/logout", logoutSeller);

router.get("/me", sellerAuth, getSellerProfile);

export default router;