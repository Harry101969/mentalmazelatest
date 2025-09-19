import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request) {
  try {
    await dbConnect();

    if (request.method === 'GET') {
      const users = await User.find({})
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(100); // Limit to recent 100 users for performance

      return Response.json({
        users
      });
    }
  } catch (error) {
    console.error('Admin users error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);