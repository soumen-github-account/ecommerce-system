import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
        required: true
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true
    },

    sku: {
        type: String,
        required: true,
        index: true
    },
    availableStock: {
        type: Number,
        default: 0
    },

    reservedStock: {
        type: Number,
        default: 0
    },

    damagedStock: {
        type: Number,
        default: 0
    },

    returnedStock: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

InventorySchema.index({
    variant: 1,
    warehouse: 1
}, {
    unique: true
});

export const Inventory = mongoose.model("Inventory", InventorySchema);

