import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
      },
       size: {
          type: String,
          required: true,
        },
      quantity: {
        type: Number,
        default: 1
      },
    }],
    coupons:[{
      
     appliedCoupon: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Coupon",
     default: null,
     },

    discount: {
      type: Number,
      default: 0,
   },

  total: {
    type: Number,
    default: 0,
  },
}],
    
  
}, { timestamps: true }
)

export default mongoose.model("cart" ,cartSchema)