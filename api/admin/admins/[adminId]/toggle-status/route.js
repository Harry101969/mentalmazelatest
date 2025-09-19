import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

async function handler(request, { params }) {
  try {
    await dbConnect();
    const { adminId } = params;
    const currentUser = request.user;

    // Prevent self-deactivation
    if (currentUser.userId === adminId) {
      return Response.json(
        { message: 'You cannot deactivate your own account' },
        { status: 400 }
      );
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return Response.json(
        { message: 'Administrator not found' },
        { status: 404 }
      );
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { 
        isActive: !admin.isActive,
        updatedAt: new Date()
      },
      { new: true }
    );

    return Response.json({
      message: `Administrator ${updatedAdmin.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle admin status error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = withAdminAuth(handler);