import mongoose from "mongoose";
import User from "../models/UserModel.js";

export const getOrCreateFirebaseUser = async (req, res) => {
  try {

    const {
      phone,
      firstName,
      lastName,
      email
    } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
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

    } else {

      // Optional:
      // Firebase login ke time missing
      // profile data update kar sakte ho

      let changed = false;

      if (firstName && user.firstName !== firstName) {
        user.firstName = firstName;
        changed = true;
      }

      if (lastName && user.lastName !== lastName) {
        user.lastName = lastName;
        changed = true;
      }

      if (email && user.email !== email) {
        user.email = email;
        changed = true;
      }

      if (!user.isVerified) {
        user.isVerified = true;
        changed = true;
      }

      if (changed) {
        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.error(
      "Get/Create Firebase User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserByIdInternal = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserInternal = async (req, res) => {

    try {

        const { userId } =
            req.params;


        //------------------------------------------
        // Validate
        //------------------------------------------

        if (!userId) {

            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                userId
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid User ID",
            });

        }


        //------------------------------------------
        // Find User
        //------------------------------------------

        const user =
            await User.findById(userId)
                .select(
                    "firstName lastName email phone fullName"
                )
                .lean();


        //------------------------------------------
        // Not Found
        //------------------------------------------

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });

        }


        //------------------------------------------
        // Response
        //------------------------------------------

        return res.status(200).json({

            success: true,

            user,

        });

    } catch (error) {

        console.error(
            "[USER] GET INTERNAL USER ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};