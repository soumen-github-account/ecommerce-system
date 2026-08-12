import jwt from "jsonwebtoken";
import admin from "../config/firebase.js";
import axios from "axios"


export const firebaseLogin = async (req, res) => {
  try {
    const { token, firstName, lastName, email } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token is required",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    const phone = decodedToken.phone_number;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number not found",
      });
    }

    const userResponse = await axios.post(`${process.env.USER_SERVICE_URL}/users/auth/firebase-user`, {phone, firstName, lastName, email});
    if (!userResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: "Unable to create/get user",
      });
    }

    const user = userResponse.data.user;

    const jwtToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    console.log(decodedToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: jwtToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

