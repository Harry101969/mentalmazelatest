import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;

    if (request.method === 'GET') {
      const user = await User.findById(userId).select('moodTracker');
      if (!user) {
        return Response.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      // Sort mood entries by date (newest first)
      const entries = user.moodTracker.sort((a, b) => new Date(b.date) - new Date(a.date));

      return Response.json({
        entries
      });
    }

    if (request.method === 'POST') {
      const { mood, notes, activities, emotions } = await request.json();

      if (!mood || mood < 1 || mood > 10) {
        return Response.json(
          { message: 'Valid mood rating (1-10) is required' },
          { status: 400 }
        );
      }

      const moodEntry = {
        mood,
        notes: notes || '',
        activities: activities || [],
        emotions: emotions || [],
        date: new Date()
      };

      await User.findByIdAndUpdate(userId, {
        $push: { moodTracker: moodEntry }
      });

      return Response.json({
        message: 'Mood entry saved successfully',
        entry: moodEntry
      });
    }
  } catch (error) {
    console.error('Mood entries error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);