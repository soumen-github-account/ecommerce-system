import mongoose from "mongoose";


const InventoryMovementSchema = new mongoose.Schema({
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory"
    },

    sku: String,

    type: {
        type: String,
        enum: [
            "PURCHASE",
            "SALE",
            "RETURN",
            "DAMAGE",
            "ADJUSTMENT"
        ]
    },

    quantity: Number,

    previousStock: Number,

    currentStock: Number,

    referenceId: String,

    note: String

}, {timestamps: true});

