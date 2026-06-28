// import jwt from "jsonwebtoken";
// import { Seller } from "../models/SellerModel.js";

// const sellerAuth = async (req, res, next) => {
//     console.log("sellerAuth called");

//     try {

//         const token = req.cookies.sellerToken;
//         console.log("Cookies =>", req.cookies);
//         console.log("Token =>", token);
//         if (!token) {

//             return res.status(401).json({

//                 success: false,

//                 message: "Please login."

//             });

//         }

//         const decoded = jwt.verify(

//             token,

//             process.env.SELLER_JWT_SECRET

//         );

//         const seller = await Seller.findById(decoded.sellerId)

//             .select("-password");

//         if (!seller) {

//             return res.status(404).json({

//                 success: false,

//                 message: "Seller not found."

//             });

//         }

//         req.seller = seller;

//         next();

//     } catch (error) {

//         return res.status(401).json({

//             success: false,

//             message: "Invalid Token."

//         });

//     }

// };

import jwt from "jsonwebtoken";
import { Seller } from "../models/SellerModel.js";

const sellerAuth = async (req, res, next) => {
  console.log("sellerAuth called");

  try {
    console.log("Cookies:", req.cookies);

    const token = req.cookies.sellerToken;

    console.log("Token:", token);

    if (!token) {
      console.log("No token found");

      return res.status(401).json({
        success: false,
        message: "Please login.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.SELLER_JWT_SECRET
    );

    console.log("Decoded:", decoded);

    const seller = await Seller.findById(decoded.sellerId)
      .select("-password");

    console.log("Seller:", seller);

    if (!seller) {
      console.log("Seller not found");

      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    req.seller = seller;

    next();

  } catch (error) {
    console.log("JWT Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid Token.",
    });
  }
};

export default sellerAuth;
