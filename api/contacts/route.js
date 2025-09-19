import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;

    if (request.method === 'GET') {
      const user = await User.findById(userId).select('contacts');
      if (!user) {
        return Response.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      return Response.json({
        contacts: user.contacts || []
      });
    }

    if (request.method === 'POST') {
      const { name, phone, relationship, isEmergency } = await request.json();

      if (!name || !phone) {
        return Response.json(
          { message: 'Name and phone are required' },
          { status: 400 }
        );
      }

      const contact = {
        name,
        phone,
        relationship: relationship || 'Friend',
        isEmergency: isEmergency || false
      };

      await User.findByIdAndUpdate(userId, {
        $push: { contacts: contact }
      });

      return Response.json({
        message: 'Contact added successfully',
        contact
      });
    }
  } catch (error) {
    console.error('Contacts error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);