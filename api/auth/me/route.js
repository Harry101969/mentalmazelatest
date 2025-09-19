import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return Response.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    let user;
    if (currentUser.role === 'admin') {
      user = await Admin.findById(currentUser.userId).select('-password');
    } else {
      user = await User.findById(currentUser.userId).select('-password');
    }

    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is still verified/active
    if (currentUser.role === 'admin' && !user.isActive) {
      return Response.json(
        { message: 'Admin account deactivated' },
        { status: 401 }
      );
    }

    if (currentUser.role === 'user' && !user.isVerified) {
      return Response.json(
        { message: 'Email not verified' },
        { status: 401 }
      );
    }

    return Response.json({
      user: {
        id: user._id,
        ...user.toObject()
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}