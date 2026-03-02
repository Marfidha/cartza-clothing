import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userdata",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        name: String, // product name at time of order
        price: Number, // price at purchase time
        size: String,
        quantity: Number,

        image: String, // optional thumbnail
      },
    ],

    // 🏠 Shipping address snapshot
    shippingAddress: {
      name: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
    },

    // 💳 Payment info
    paymentMethod: {
      type: String,
      enum: ["cod", "wallet", "razorpay"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // 📦 Order lifecycle
    orderStatus: {
      type: String,
      enum: [
        "processing",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "processing",
    },

    // 🧾 Pricing breakdown
    subtotal: Number,
    tax: Number,
    shipping: Number,

    
    coupon:Object,

    // 💰 Final payable amount
    totalAmount: {
      type: Number,
      required: true,
    },

    // 🚚 Tracking (optional)
    // trackingId: String,

    // 📝 Optional notes
    // notes: String,
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
