import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request, { params }) {
  try {
    await dbConnect();
    const userId = request.user.userId;
    const { contactId } = params;

    if (request.method === 'PUT') {
      const { name, phone, relationship, isEmergency } = await request.json();

      if (!name || !phone) {
        return Response.json(
          { message: 'Name and phone are required' },
          { status: 400 }
        );
      }

      await User.findOneAndUpdate(
        { _id: userId, 'contacts._id': contactId },
        {
          $set: {
            'contacts.$.name': name,
            'contacts.$.phone': phone,
            'contacts.$.relationship': relationship || 'Friend',
            'contacts.$.isEmergency': isEmergency || false
          }
        }
      );

      return Response.json({
        message: 'Contact updated successfully'
      });
    }

    if (request.method === 'DELETE') {
      await User.findByIdAndUpdate(userId, {
        $pull: { contacts: { _id: contactId } }
      });

      return Response.json({
        message: 'Contact deleted successfully'
      });
    }
  } catch (error) {
    console.error('Contact operation error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);