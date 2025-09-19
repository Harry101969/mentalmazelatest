import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;
    const { tokensUsed, subscriptionType } = await request.json();

    if (!tokensUsed || tokensUsed <= 0) {
      return Response.json(
        { message: 'Valid token amount is required' },
        { status: 400 }
      );
    }

    // Verify user has enough tokens
    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.tokens < tokensUsed) {
      return Response.json(
        { message: 'Insufficient tokens' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await Payment.create({
      userId,
      amount: 0, // No money charged, only tokens
      currency: 'INR',
      status: 'completed',
      paymentMethod: 'tokens',
      subscriptionType: subscriptionType || 'premium',
      tokensUsed,
      metadata: {
        tokenUpgrade: true,
        tokensDeducted: tokensUsed
      }
    });

    // Update user subscription and deduct tokens
    await User.findByIdAndUpdate(userId, {
      subscription: subscriptionType || 'premium',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      $inc: { tokens: -tokensUsed }
    });

    return Response.json({
      message: 'Subscription upgraded successfully using tokens',
      subscription: subscriptionType || 'premium',
      tokensUsed
    });
  } catch (error) {
    console.error('Token upgrade error:', error);
    return Response.json(
      { message: 'Token upgrade failed' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);