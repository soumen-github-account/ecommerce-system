import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    referral: {
        type: String,
        default: ""
    },

    password: {
        type: String,
        required: true
    },

    business: {

        businessName: {
            type: String,
            required: true
        },

        businessType: {
            type: String,
            enum: [
                "Private Limited",
                "Partnership",
                "Proprietorship",
                "LLP"
            ],
            required: true
        },

        gstin: {
            type: String,
            default: ""
        },

        pan: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        }

    },

    store: {

        storeName: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        storeSlug: {
            type: String,
            unique: true
        },

        description: {
            type: String,
            default: ""
        },

        fullAddress: String,
        placeId: String,
        latitude: Number,
        longitude: Number,
        city: String,
        state: String,
        country: String,
        pincode: String,

        logo: {

            public_id: String,

            url: String
        }

    },

    bank: {

        holderName: String,

        bankName: String,

        accountNumber: String,

        ifsc: String,

        accountType: String,

        verified: {
            type: Boolean,
            default: false
        }

    },

    kyc: {

    aadhar: {
        public_id: String,
        url: String,
        resource_type: String,
        format: String,
        originalName: String
    },

    panCard: {
        public_id: String,
        url: String,
        resource_type: String,
        format: String,
        originalName: String
    },

    businessProof: {
        public_id: String,
        url: String,
        resource_type: String,
        format: String,
        originalName: String
    }

    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Approved",
            "Rejected",
            "Suspended"
        ],
        default: "Pending"
    },

    rejectReason: {
        type: String,
        default: ""
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    isPhoneVerified: {
        type: Boolean,
        default: false
    },

    lastLogin: Date

},
{
    timestamps: true
});

export const Seller = mongoose.model("Seller", sellerSchema);

