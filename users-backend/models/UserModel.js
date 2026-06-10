
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    otp: {
        type: String,
        required: false
    },
    otpExpiresAt: {
        type: Date,
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const User = new mongoose.model("User", UserSchema)
export default User;