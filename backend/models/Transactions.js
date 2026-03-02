import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "order_payment",
        "wallet_topup",
        "refund",
        "cashback",
        "withdrawal",
      ],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["wallet", "upi", "card", "cod"],
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "success",
    },

    referenceId: String, // orderId or paymentId

    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);