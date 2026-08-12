// import UserCredential from "../models/UserCredential.model.js";

// import { verifyFirebaseToken } from "./otp.service.js";

// import { generateAccessToken, generateRefreshToken } from "./token.service.js";

// export const firebaseLoginService = async (data) => {
//   const { token, email } = data;
//   const firebaseUser = await verifyFirebaseToken(token);
//   const phone = firebaseUser.phone_number;

//   if (!phone) {
//     throw new Error("Phone number missing");
//   }

//   let user = await UserCredential.findOne({
//     firebaseUid: firebaseUser.uid,
//   });

//   if (!user) {
//     user = await UserCredential.create({
//       firebaseUid: firebaseUser.uid,

//       phone,

//       email: email || null,

//       role: "customer",

//       isVerified: true,
//     });
//   }

//   const accessToken = generateAccessToken(user);

//   const refreshToken = await generateRefreshToken(user);

//   return {
//     user: {
//       id: user._id,

//       role: user.role,

//       phone: user.phone,
//     },

//     accessToken,

//     refreshToken,
//   };
// };

import jwt from "jsonwebtoken";
import UserCredential from "../models/UserCredential.model.js";
import { verifyFirebaseToken } from "./otp.service.js";

export const firebaseLoginService = async (data) => {

    const {
        token,
        firstName,
        lastName,
        email
    } = data;

    const decodedToken =
        await verifyFirebaseToken(token);

    const phone =
        decodedToken.phone_number;

    if (!phone) {
        throw new Error("Phone number not found");
    }

    let user =
        await UserCredential.findOne({
            phone
        });

    if (!user) {

        user =
            await UserCredential.create({

                firebaseUid:
                    decodedToken.uid,

                phone,

                firstName,

                lastName,

                email,

                role: "customer",

                isVerified: true

            });

    }

    const jwtToken =
        jwt.sign(

            {

                id: user._id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "30d"

            }

        );

    return {

        token: jwtToken,

        user

    };

};