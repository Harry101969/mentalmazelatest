import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate stats
    const stats = {
      currentLevel: user.gameProgress.currentLevel,
      levelsCompleted: user.gameProgress.levelsCompleted.length,
      totalTimeSpent: user.gameProgress.totalTimeSpent,
      currentStreak: calculateStreak(user.gameProgress.lastActivity),
      tokens: user.tokens
    };

    // Get recent mood entries
    const recentMoods = user.moodTracker
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    return Response.json({
      stats,
      recentMoods,
      user: {
        id: user._id,
        name: user.name,
        nickname: user.nickname,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateStreak(lastActivity) {
  if (!lastActivity) return 0;
  
  const now = new Date();
  const last = new Date(lastActivity);
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  
  // If last activity was today or yesterday, return 1, otherwise 0
  return diffDays <= 1 ? 1 : 0;
}

export const GET = withAuth(handler);