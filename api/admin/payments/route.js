import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

async function handler(request) {
  try {
    await dbConnect();

    if (request.method === 'GET') {
      const payments = await Payment.find({})
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(100); // Limit to recent 100 payments

      return Response.json({
        payments
      });
    }
  } catch (error) {
    console.error('Admin payments error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);