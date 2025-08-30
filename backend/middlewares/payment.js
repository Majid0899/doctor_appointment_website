import { razorpay } from "../config/razorpay.js";
import dotenv from 'dotenv'
dotenv.config()

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // doctor.fees (in rupees)

    const options = {
      amount: amount * 100, // Razorpay takes amount in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
