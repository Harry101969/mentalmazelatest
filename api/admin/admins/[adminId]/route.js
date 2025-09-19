import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

async function handler(request, { params }) {
  try {
    await dbConnect();
    const { adminId } = params;
    const currentUser = request.user;

    // Prevent self-deletion
    if (currentUser.userId === adminId) {
      return Response.json(
        { message: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    if (request.method === 'DELETE') {
      const deletedAdmin = await Admin.findByIdAndDelete(adminId);
      
      if (!deletedAdmin) {
        return Response.json(
          { message: 'Administrator not found' },
          { status: 404 }
        );
      }

      return Response.json({
        message: 'Administrator deleted successfully'
      });
    }
  } catch (error) {
    console.error('Admin operation error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const DELETE = withAdminAuth(handler);