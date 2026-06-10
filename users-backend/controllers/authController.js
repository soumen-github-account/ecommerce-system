// import User from "../models/UserModel.js";
// import jwt from "jsonwebtoken"


// export const registerController = async(req, res) => {
//     try {
//         const {firstName, lastName, email, phone} = req.body

//         if(!firstName || !lastName || !email || !phone) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }

//         const existingUser = await User.findOne({
//             $or: [{email}, {phone}]
//         })

//         if(existingUser){
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists"
//             });
//         }

//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         const user = await User.create({
//             firstName, lastName, email, phone, otp,
//             otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000)
//         })

//         return res.status(201).json({
//             success: true,
//             message: "OTP sent successfully",
//             userId: user._id
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// export const verifyOtp = async(req, res) => {
//     try {
//         const { phone, otp } = req.body;

//         const user = await User.findOne({ phone });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         if (user.otp !== otp) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid OTP"
//             });
//         }

//         if (user.otpExpiresAt < new Date()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP expired"
//             });
//         }

//         user.isVerified = true;
//         user.otp = null;
//         user.otpExpiresAt = null;

//         await user.save();

//         const token = jwt.sign(
//             {
//                 id: user._id
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "30d"
//             }
//         );

//         return res.status(200).json({
//             success: true,
//             token,
//             user
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// export const login = async (req, res) => {
//     try {

//         const { phone } = req.body;

//         const user = await User.findOne({ phone });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const otp = Math.floor(
//             100000 + Math.random() * 900000
//         ).toString();

//         user.otp = otp;
//         user.otpExpiresAt = new Date(
//             Date.now() + 5 * 60 * 1000
//         );

//         await user.save();

//         return res.status(200).json({
//             success: true,
//             message: "OTP sent"
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }
// };

// export const verifyLoginOtp = async (req, res) => {
//     try {

//         const { phone, otp } = req.body;

//         const user = await User.findOne({ phone });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         if (user.otp !== otp) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid OTP"
//             });
//         }

//         if (user.otpExpiresAt < new Date()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP expired"
//             });
//         }

//         user.otp = null;
//         user.otpExpiresAt = null;

//         await user.save();

//         const token = jwt.sign(
//             {
//                 id: user._id
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "30d"
//             }
//         );

//         return res.status(200).json({
//             success: true,
//             token,
//             user
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }
// };


import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import admin from "../config/firebase.js";

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

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        firstName,
        lastName,
        email,
        isVerified: true,
      });
    }

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

