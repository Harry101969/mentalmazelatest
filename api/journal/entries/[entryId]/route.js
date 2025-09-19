import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request, { params }) {
  try {
    await dbConnect();
    const userId = request.user.userId;
    const { entryId } = params;

    if (request.method === 'PUT') {
      const { title, content, mood, tags, prompt } = await request.json();

      if (!title || !content) {
        return Response.json(
          { message: 'Title and content are required' },
          { status: 400 }
        );
      }

      await User.findOneAndUpdate(
        { _id: userId, 'journalEntries._id': entryId },
        {
          $set: {
            'journalEntries.$.title': title,
            'journalEntries.$.content': content,
            'journalEntries.$.mood': mood || 5,
            'journalEntries.$.tags': tags || [],
            'journalEntries.$.prompt': prompt || '',
            'journalEntries.$.updatedAt': new Date()
          }
        }
      );

      return Response.json({
        message: 'Journal entry updated successfully'
      });
    }

    if (request.method === 'DELETE') {
      await User.findByIdAndUpdate(userId, {
        $pull: { journalEntries: { _id: entryId } }
      });

      return Response.json({
        message: 'Journal entry deleted successfully'
      });
    }
  } catch (error) {
    console.error('Journal entry operation error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);