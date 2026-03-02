import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },

  type: {
    type: String,
    enum: ["PERCENT", "FLAT"],
    required: true,
  },

  value: {
    type: Number,
    required: true, 
  },

  minOrderValue: {
    type: Number,
    default: 0,
  },

  maxDiscount: {
    type: Number, 
  },
    usageLimit: {
      type: Number,
      default: null,
    },
     oneTimePerUser: {
      type: Boolean,
      default: false,
    },

    startDate: {
      type: Date,
    },

  expiryDate: {
    type: Date,
  },

  status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    
  },
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
