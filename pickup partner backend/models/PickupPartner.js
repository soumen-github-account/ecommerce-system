import mongoose from "mongoose"

const pickupPartnerSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },

    dob: Date,

    profileImage: {
      type: String,
      default: "",
    },

    address: {
      houseNo: String,
      street: String,
      landmark: String,
      village: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
      latitude: Number,
      longitude: Number,
    },

    vehicle: {
      type: {
        type: String,
        enum: ["Bike", "Scooter", "Cycle", "Car", "Van", "Truck"],
      },
      brand: String,
      model: String,
      color: String,
      vehicleNumber: String,
      fuelType: String,
      rcNumber: String,
      drivingLicenseNumber: String,
    },

    documents: {
      aadhaarFront: String,
      aadhaarBack: String,
      panCard: String,
      drivingLicenseFront: String,
      drivingLicenseBack: String,
      rcBook: String,
      profilePhoto: String,
      selfieWithId: String,
    },

    bank: {
      accountHolder: String,
      accountNumber: String,
      ifsc: String,
      bankName: String,
      upiId: String,
    },

    serviceArea: {
      currentLocation: {
        address: String,
        latitude: Number,
        longitude: Number,
      },

      radiusKm: {
        type: Number,
        default: 10,
      },

      workingAreas: [
        {
          type: String,
        },
      ],

      workingTime: {
        startTime: String,

        endTime: String,
      },

      workingDays: [
        {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
      ],

      deliveryTypes: [
        {
          type: String,
          enum: [
            "SELLER_PICKUP",
            "HUB_PICKUP",
            "WAREHOUSE_PICKUP",
            "EXPRESS_PICKUP",
          ],
        },
      ],
    },
    
    partnerStatus: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "PENDING",
    },
    online: {
      type: Boolean,
      default: false,
    },

    availabilityStatus: {
      type: String,
      enum: ["AVAILABLE", "ON_PICKUP", "AT_HUB", "OFFLINE"],
      default: "OFFLINE",
    },

    currentLocation: {
      latitude: Number,
      longitude: Number,
      updatedAt: Date,
    },

    rating: {
      type: Number,
      default: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    totalPickupCompleted: {
      type: Number,
      default: 0,
    },

    totalOrdersAssigned: {
      type: Number,
      default: 0,
    },

    totalCancelled: {
      type: Number,
      default: 0,
    },

    totalDistanceKm: {
      type: Number,
      default: 0,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    pendingSettlement: {
      type: Number,
      default: 0,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    approvedAt: Date,

    rejectionReason: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("PickupPartner", pickupPartnerSchema);
