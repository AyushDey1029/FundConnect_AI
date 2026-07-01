import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

async function test() {
  try {
    const options = {
      amount: 1000 * 100,
      currency: 'INR',
      receipt: `rcpt_123456_a1b2c3`,
    };
    const order = await razorpayInstance.orders.create(options);
    console.log("Success:", order);
  } catch (error) {
    console.error("Error creating order:", error);
  }
}

test();
