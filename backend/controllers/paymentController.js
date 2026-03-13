import crypto from "crypto";
import razorpay from "../config/RazorPay.js";

export const createRazorpayOrder = async (req, res) => {

  try {

    const { amount } = req.body;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert ₹ to paise
      currency: "INR",
      receipt: `order_${Date.now()}`
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order"
    });

  }

};
export const verifyRazorpayPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userid,
      items,
      total
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // ❌ signature invalid
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success:false,
        message:"Payment verification failed"
      });
    }


    res.json({
      success:true,
      message:"Payment verified",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Server error"
    });

  }

};