import jwt from "jsonwebtoken";

const generateSellerToken = (sellerId) => {
    return jwt.sign(
        {
            sellerId,
            role: "seller"
        },
        process.env.SELLER_JWT_SECRET,
        {
            expiresIn: process.env.SELLER_JWT_EXPIRE
        }
    );
};

export default generateSellerToken;