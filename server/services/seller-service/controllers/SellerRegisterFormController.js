
import generateSellerToken from "../utils/generateSellerToken.js";
import { generateSlug } from "../utils/generateSlug.js";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../utils/sellerDetailsUpload.js";
import { Seller } from "../models/SellerModel.js";

export const sellerRegister = async(req, res) => {
    console.log("BODY:", req.body);
    try {
        const {fullName, email, phone, referral, password, businessName, businessType, gstin, pan, address, storeName, category, description, 
                fullAddress,
                placeId,
                latitude,
                longitude,
                city,
                state,
                country,
                pincode, holderName, bankName, accountNumber, ifsc, accountType } = req.body;

        if(
            !fullName ||
            !email ||
            !phone ||
            !password ||
            !businessName ||
            !businessType ||
            !pan ||
            !address ||
            !storeName ||
            !category
        ){
            return res.status(400).json({
                success:false,
                message:"Please fill all required fields."
            });
        }

        const emailExists = await Seller.findOne({email});

        if(emailExists){

            return res.status(409).json({

                success:false,
                message:"Email already registered."

            });

        }

        const phoneExists = await Seller.findOne({phone});

        if(phoneExists){

            return res.status(409).json({

                success:false,
                message:"Phone already registered."

            });

        }
        const hashedPassword = await bcrypt.hash(password,12);
        const storeSlug = await generateSlug(storeName);

        let logo = {};

        if(req.files?.storeLogo?.[0]){

            logo = await uploadToCloudinary(

                req.files.storeLogo[0],

                "ecommerce/store-logo"

            );

        }
        let aadhar = {};

        if(req.files?.aadhar?.[0]){

            aadhar = await uploadToCloudinary(

                req.files.aadhar[0],

                "ecommerce/kyc/aadhar"

            );

        }

        let panCard = {};

        if(req.files?.panCard?.[0]){

            panCard = await uploadToCloudinary(

                req.files.panCard[0],

                "ecommerce/kyc/pan"

            );

        }
        let businessProof = {};

        if(req.files?.businessProof?.[0]){
            businessProof = await uploadToCloudinary(
                req.files.businessProof[0],
                "ecommerce/kyc/business-proof"
            );
        }
        console.log({
            fullAddress,
            placeId,
            latitude,
            longitude,
            city,
            state,
            country,
            pincode
        });

        const seller = await Seller.create({

            fullName,

            email,

            phone,

            referral,

            password:hashedPassword,

            business:{

                businessName,

                businessType,

                gstin,

                pan,

                address

            },

            store: {

                storeName,

                category,

                storeSlug,

                description,

                fullAddress,

                placeId,

                latitude,

                longitude,

                city,

                state,

                country,

                pincode,

                logo

            },

            bank:{

                holderName,

                bankName,

                accountNumber,

                ifsc,

                accountType

            },

            kyc:{

                aadhar,

                panCard,

                businessProof

            }

        });

        return res.status(201).json({

            success:true,

            message:"Seller registered successfully.",

            sellerId:seller._id

        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

export const sellerLogin = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });

        }

        const seller = await Seller.findOne({ email });

        if (!seller) {

            return res.status(404).json({
                success: false,
                message: "Seller not found."
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            seller.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });

        }
        if (seller.status !== "Approved") {
            return res.status(403).json({
                success: false,
                message: "Your seller account is under review. Please wait for approval.",
            });
        }

        const token = generateSellerToken(seller._id);

        res.cookie("sellerToken", token, {

            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite: "lax",

            maxAge: 7 * 24 * 60 * 60 * 1000

        });

        seller.lastLogin = new Date();

        await seller.save();

        return res.status(200).json({
            success: true,
            message: "Login Successful."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const logoutSeller = (req, res) => {

    res.clearCookie("sellerToken");

    return res.json({

        success: true,

        message: "Logout Successful."

    });

};

export const getSellerProfile = async (req, res) => {

    return res.json({

        success: true,

        seller: req.seller

    });

};