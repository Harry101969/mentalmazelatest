import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;
    const { amount, tokensUsed, subscriptionType } = await request.json();

    if (!amount || amount <= 0) {
      return Response.json(
        { message: 'Valid amount is required' },
        { status: 400 }
      );
    }

    // Verify user exists and has enough tokens if using them
    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (tokensUsed > 0 && user.tokens < tokensUsed) {
      return Response.json(
        { message: 'Insufficient tokens' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const orderOptions = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        userId: userId,
        subscriptionType: subscriptionType || 'premium',
        tokensUsed: tokensUsed || 0
      }
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Create payment record
    const payment = await Payment.create({
      userId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'razorpay',
      subscriptionType: subscriptionType || 'premium',
      tokensUsed: tokensUsed || 0,
      metadata: {
        razorpayOrderId: razorpayOrder.id,
        originalAmount: amount + (tokensUsed || 0)
      }
    });

    return Response.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Create order error:', error);
    return Response.json(
      { message: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);