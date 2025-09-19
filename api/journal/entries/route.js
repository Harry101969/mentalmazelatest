import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;

    if (request.method === 'GET') {
      const user = await User.findById(userId).select('journalEntries');
      if (!user) {
        return Response.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      // Sort journal entries by date (newest first)
      const entries = user.journalEntries
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(entry => ({
          _id: entry._id,
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags,
          prompt: entry.prompt,
          createdAt: entry.createdAt
        }));

      return Response.json({
        entries
      });
    }

    if (request.method === 'POST') {
      const { title, content, mood, tags, prompt } = await request.json();

      if (!title || !content) {
        return Response.json(
          { message: 'Title and content are required' },
          { status: 400 }
        );
      }

      const journalEntry = {
        title,
        content,
        mood: mood || 5,
        tags: tags || [],
        prompt: prompt || '',
        createdAt: new Date()
      };

      await User.findByIdAndUpdate(userId, {
        $push: { journalEntries: journalEntry }
      });

      return Response.json({
        message: 'Journal entry saved successfully',
        entry: journalEntry
      });
    }
  } catch (error) {
    console.error('Journal entries error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);