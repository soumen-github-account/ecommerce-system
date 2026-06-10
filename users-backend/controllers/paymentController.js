import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, orderId: order.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Payment Controller
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  // Logic: Razorpay signature verify karein
  // Agar sahi hai, toh MongoDB mein Order status 'Paid' mark karein
  res.status(200).json({ success: true, message: "Payment verified!" });
};

