import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;
    const { sessionId, sessionTitle, duration, completedAt } = await request.json();

    // Add meditation session to user's activity log
    await User.findByIdAndUpdate(userId, {
      $push: {
        'activities.meditation': {
          sessionId,
          sessionTitle,
          duration,
          completedAt: new Date(completedAt)
        }
      },
      $inc: { tokens: 1 } // Award 1 token for meditation
    });

    return Response.json({
      message: 'Meditation session logged successfully',
      tokensEarned: 1
    });
  } catch (error) {
    console.error('Meditation log error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);