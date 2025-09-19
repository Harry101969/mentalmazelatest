import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;
    const { level, completed, score, timeSpent, moves, cycles, journalEntry } = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update game progress
    const updates = {
      $addToSet: { 'gameProgress.levelsCompleted': level },
      $inc: { 'gameProgress.totalTimeSpent': timeSpent },
      $set: { 
        'gameProgress.lastActivity': new Date(),
        'gameProgress.currentLevel': Math.max(user.gameProgress.currentLevel || 1, level + 1)
      }
    };

    // Add level score
    const levelScore = {
      level,
      score,
      timeSpent,
      completedAt: new Date()
    };

    if (moves !== undefined) levelScore.moves = moves;
    if (cycles !== undefined) levelScore.cycles = cycles;

    // Remove existing score for this level and add new one
    await User.findByIdAndUpdate(userId, {
      $pull: { 'gameProgress.levelScores': { level } }
    });

    await User.findByIdAndUpdate(userId, {
      ...updates,
      $push: { 'gameProgress.levelScores': levelScore }
    });

    // Add journal entry if provided
    if (journalEntry) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          journalEntries: {
            level,
            content: journalEntry,
            mood: 5, // Default mood for game completion
            createdAt: new Date()
          }
        }
      });
    }

    // Award tokens for completion
    const tokensEarned = level * 2; // 2 tokens per level
    await User.findByIdAndUpdate(userId, {
      $inc: { tokens: tokensEarned }
    });

    return Response.json({
      message: 'Level completed successfully',
      tokensEarned,
      levelScore
    });
  } catch (error) {
    console.error('Complete level error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);