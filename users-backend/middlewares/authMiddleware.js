import jwt from "jsonwebtoken"
import User from "../models/UserModel.js";

export const protect = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Authorization token missing"
            })
        }

        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await User.findById(decode.id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}