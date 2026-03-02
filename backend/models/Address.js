import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Contact info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },

    // Address details
    pincode: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: String,
      required: true,
    },
    addressLine: {
      type: String,
      required: true, // locality, building, street
    },
    locality: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    // district: {
    //   type: String,
    //   required: true,
    // },
    state: {
      type: String,
      required: true,
    },

    // Address meta
    addressType: {
      type: String,
      enum: ["Home", "Office"],
      default: "Home",
    },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Address", addressSchema);
