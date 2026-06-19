import mongoose from "mongoose";

const WarehouseSchema = new mongoose.Schema({
    name: String,

    code: {
        type: String,
        unique: true
    },
    address: {
        state: String,
        city: String,
        pincode: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

export const Warehouse = mongoose.model("Warehouse", WarehouseSchema);
