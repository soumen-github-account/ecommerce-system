import mongoose from "mongoose";

const shipmentLogSchema = new mongoose.Schema(
{
    status: {
        type: String,
        enum: [
            "LABEL_GENERATED",
            "READY_TO_SHIP",
            "PICKUP_SCHEDULED",
            "PICKED_UP",
            "IN_TRANSIT",
            "ARRIVED_AT_HUB",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "DELIVERY_FAILED",
            "RETURN_INITIATED",
            "RETURN_PICKED",
            "RETURN_COMPLETED",
            "CANCELLED"
        ]
    },

    location: String,

    description: String,

    updatedBy: {
        type: String,
        enum: [
            "SYSTEM",
            "SELLER",
            "COURIER",
            "ADMIN"
        ],
        default: "SYSTEM"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

},
{
    _id: false
});

const shipmentSchema = new mongoose.Schema(
{

    //----------------------------------
    // Relations
    //----------------------------------

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },

    //----------------------------------
    // Shipment Identity
    //----------------------------------

    shipmentNumber: {
        type: String,
        unique: true,
        index: true
    },

    trackingNumber: {
        type: String,
        unique: true,
        index: true
    },

    awbNumber: {
        type: String,
        default: null
    },

    //----------------------------------
    // Courier
    //----------------------------------

    courier: {
        type: String,
        default: ""
    },

    courierTrackingId: {
        type: String,
        default: ""
    },

    courierServiceType: {
        type: String,
        default: ""
    },

    //----------------------------------
    // Shipment Status
    //----------------------------------

    status: {
        type: String,
        enum: [
            "PENDING",
            "LABEL_GENERATED",
            "READY_TO_SHIP",
            "PICKUP_SCHEDULED",
            "PICKED_UP",
            "IN_TRANSIT",
            "ARRIVED_AT_HUB",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "DELIVERY_FAILED",
            "RETURN_INITIATED",
            "RETURN_PICKED",
            "RETURN_COMPLETED",
            "CANCELLED"
        ],
        default: "PENDING",
        index: true
    },

    //----------------------------------
    // Shipping Address Snapshot
    //----------------------------------

    shippingAddress: {

        fullName: String,

        phone: String,

        addressLine1: String,

        addressLine2: String,

        landmark: String,

        city: String,

        state: String,

        country: String,

        pincode: String

    },

    //----------------------------------
    // Package Details
    //----------------------------------

    package: {

        weight: Number,

        length: Number,

        breadth: Number,

        height: Number,

        volumetricWeight: Number

    },

    //----------------------------------
    // Charges
    //----------------------------------

    shippingCharge: {
        type: Number,
        default: 0
    },

    //----------------------------------
    // Generated Documents
    //----------------------------------

    documents: {

        shippingLabelPdf: String,

        invoicePdf: String,

        packingSlipPdf: String

    },

    //----------------------------------
    // Barcode / QR
    //----------------------------------

    barcodeImage: String,

    qrCodeImage: String,

    //----------------------------------
    // Dates
    //----------------------------------

    labelGeneratedAt: Date,

    invoiceGeneratedAt: Date,

    packingSlipGeneratedAt: Date,

    pickupDate: Date,

    shippedAt: Date,

    expectedDeliveryDate: Date,

    outForDeliveryAt: Date,

    deliveredAt: Date,

    //----------------------------------
    // Logs
    //----------------------------------

    logs: {
        type: [shipmentLogSchema],
        default: []
    },

    //----------------------------------
    // Notes
    //----------------------------------

    sellerNotes: String,

    adminNotes: String

},
{
    timestamps: true
});

export const Shipment = mongoose.model(
    "Shipment",
    shipmentSchema
);