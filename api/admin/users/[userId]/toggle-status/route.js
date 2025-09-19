import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request, { params }) {
  try {
    await dbConnect();
    const { userId } = params;

    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        isVerified: !user.isVerified,
        updatedAt: new Date()
      },
      { new: true }
    );

    return Response.json({
      message: `User ${updatedUser.isVerified ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = withAdminAuth(handler);