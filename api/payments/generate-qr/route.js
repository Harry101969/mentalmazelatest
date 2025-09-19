import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';
import QRCode from 'qrcode';

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

    // Create payment record
    const payment = await Payment.create({
      userId,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'qr_code',
      subscriptionType: subscriptionType || 'premium',
      tokensUsed: tokensUsed || 0,
      metadata: {
        qrGenerated: true,
        originalAmount: amount + (tokensUsed || 0)
      }
    });

    // Generate UPI payment string
    const upiString = `upi://pay?pa=mindmaze@paytm&pn=MindMaze&am=${amount}&cu=INR&tn=Premium Subscription Payment&tr=${payment._id}`;
    
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(upiString, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return Response.json({
      qrCodeUrl,
      paymentId: payment._id,
      amount,
      upiString
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return Response.json(
      { message: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);