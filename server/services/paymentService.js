import Razorpay from "razorpay";

export const createRazorpayOrder = async (amount) => {
  try {
    console.log("🔥 Razorpay Key ID exists:", !!process.env.RAZORPAY_KEY_ID);
    console.log(
      "🔥 Razorpay Secret exists:",
      !!process.env.RAZORPAY_KEY_SECRET
    );

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("🔥 Razorpay Order Options:", options);

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay Order Created:", order);

    return order;
  } catch (error) {
    console.error("❌ RAZORPAY ACTUAL ERROR");
    console.error("Message:", error.message);
    console.error("Status:", error.statusCode);
    console.error("Description:", error.description);
    console.error("Full Error:", error);

    throw error;
  }
};