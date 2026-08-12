// import jwt from "jsonwebtoken"
// import User from "../models/UserModel.js";

// export const protect = async(req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
//         console.log(authHeader)
//         if(!authHeader || !authHeader.startsWith("Bearer ")){
//             return res.status(401).json({
//                 success: false,
//                 message: "Authorization token missing"
//             })
            
//         }

//         const token = authHeader.split(" ")[1];
//         const decode = jwt.verify(token, process.env.JWT_SECRET)
        
//         const user = await User.findById(decode.id);

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         req.user = user;
//         next();
        
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token",
//         });
//     }
// }

// import jwt from "jsonwebtoken";
// import axios from "axios";

// export const protect = async (req, res, next) => {
//     try {

//         // ==========================================
//         // Authorization Header
//         // ==========================================

//         const authHeader = req.headers.authorization;

//         if (
//             !authHeader ||
//             !authHeader.startsWith("Bearer ")
//         ) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Authorization token missing"
//             });
//         }

//         // ==========================================
//         // Extract Token
//         // ==========================================

//         const token = authHeader.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Authorization token missing"
//             });
//         }

//         // ==========================================
//         // Verify JWT
//         // ==========================================

//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );

//         if (!decoded?.id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid token"
//             });
//         }

//         // ==========================================
//         // Get User From User Service
//         // ==========================================

//         const response = await axios.get(
//             `${process.env.USER_SERVICE_URL}/users/internal/${decoded.id}`,
//             {
//                 headers: {
//                     Authorization: authHeader
//                 },
//                 timeout: 5000
//             },
//         );

//         console.log(response)

//         if (!response.data?.success || !response.data?.user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         // ==========================================
//         // Attach User
//         // ==========================================

//         req.user = response.data.user;

//         next();

//     } catch (error) {

//         console.error(
//             "AUTH MIDDLEWARE ERROR:",
//             error.response?.data || error.message
//         );

//         if (error.name === "JsonWebTokenError") {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid token"
//             });
//         }

//         if (error.name === "TokenExpiredError") {
//             return res.status(401).json({
//                 success: false,
//                 message: "Token expired"
//             });
//         }

//         if (error.response?.status === 404) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         return res.status(503).json({
//             success: false,
//             message: "User service unavailable"
//         });
//     }
// };

import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        req.user = {
            id: decoded.id
        };

        next();

    } catch (error) {

        console.error("AUTH MIDDLEWARE ERROR:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};