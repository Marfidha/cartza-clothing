import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "userdata", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  rating: { type: Number, min: 1, max: 5 },
  message: { type: String, required: true },
  type: { type: String, enum: ["review", "report"], default: "review" },
  status: { type: String, enum: ["pending", "resolved"], default: "pending" },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model("Feedback", feedbackSchema)