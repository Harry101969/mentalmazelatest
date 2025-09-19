import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

async function handler(request) {
  try {
    await dbConnect();

    if (request.method === 'GET') {
      const admins = await Admin.find({})
        .select('-password')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      return Response.json({
        admins
      });
    }
  } catch (error) {
    console.error('Admin admins error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);