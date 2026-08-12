import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.model.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = async (user) => {
  const token = crypto.randomBytes(64).toString("hex");

  await RefreshToken.create({
    userId: user._id,

    token,

    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token;
};
