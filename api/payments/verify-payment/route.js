import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';
import crypto from 'crypto';

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    // Verify Razorpay signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return Response.json(
        { message: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Find and update payment record
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      userId
    });

    if (!payment) {
      return Response.json(
        { message: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Update payment status
    await Payment.findByIdAndUpdate(payment._id, {
      status: 'completed',
      razorpayPaymentId: razorpay_payment_id,
      metadata: {
        ...payment.metadata,
        razorpaySignature: razorpay_signature,
        verifiedAt: new Date()
      }
    });

    // Update user subscription and deduct tokens
    const updateData = {
      subscription: payment.subscriptionType,
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };

    if (payment.tokensUsed > 0) {
      updateData.$inc = { tokens: -payment.tokensUsed };
    }

    await User.findByIdAndUpdate(userId, updateData);

    return Response.json({
      message: 'Payment verified successfully',
      subscription: payment.subscriptionType
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return Response.json(
      { message: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);