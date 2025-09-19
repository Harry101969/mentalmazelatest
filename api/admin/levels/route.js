import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import GameLevel from '@/models/GameLevel';

async function handler(request) {
  try {
    await dbConnect();

    if (request.method === 'GET') {
      const levels = await GameLevel.find({})
        .populate('createdBy', 'name email')
        .sort({ levelNumber: 1 });

      return Response.json({
        levels
      });
    }

    if (request.method === 'POST') {
      const {
        levelNumber,
        title,
        description,
        gameType,
        isPremium,
        instructions,
        completionMessage,
        journalPrompts,
        gameConfig
      } = await request.json();

      // Validate required fields
      if (!levelNumber || !title || !description || !gameType) {
        return Response.json(
          { message: 'Level number, title, description, and game type are required' },
          { status: 400 }
        );
      }

      // Check if level number already exists
      const existingLevel = await GameLevel.findOne({ levelNumber });
      if (existingLevel) {
        return Response.json(
          { message: 'A level with this number already exists' },
          { status: 400 }
        );
      }

      // Create new level
      const newLevel = await GameLevel.create({
        levelNumber,
        title,
        description,
        gameType,
        isPremium: isPremium || false,
        content: {
          instructions: instructions || '',
          completionMessage: completionMessage || '',
          journalPrompts: journalPrompts || [],
          gameConfig: gameConfig || {},
          media: {
            images: [],
            videos: [],
            audio: []
          }
        },
        isActive: true,
        createdBy: request.user.userId
      });

      return Response.json({
        message: 'Game level created successfully',
        level: newLevel
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Admin levels error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);
export const POST = withAdminAuth(handler);