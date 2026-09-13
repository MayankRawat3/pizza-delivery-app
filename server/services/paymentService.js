import Razorpay from "razorpay";

export const createRazorpayOrder = async (amount) => {
  try {

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };


    const order = await razorpay.orders.create(options);


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