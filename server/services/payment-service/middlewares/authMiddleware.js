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