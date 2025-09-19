import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import GameLevel from '@/models/GameLevel';

async function handler(request, { params }) {
  try {
    await dbConnect();
    const { levelId } = params;

    if (request.method === 'GET') {
      const level = await GameLevel.findById(levelId).populate('createdBy', 'name email');
      
      if (!level) {
        return Response.json(
          { message: 'Game level not found' },
          { status: 404 }
        );
      }

      return Response.json({ level });
    }

    if (request.method === 'PUT') {
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

      // Check if level number conflicts with another level
      const existingLevel = await GameLevel.findOne({ 
        levelNumber, 
        _id: { $ne: levelId } 
      });
      
      if (existingLevel) {
        return Response.json(
          { message: 'Another level with this number already exists' },
          { status: 400 }
        );
      }

      const updatedLevel = await GameLevel.findByIdAndUpdate(
        levelId,
        {
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
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!updatedLevel) {
        return Response.json(
          { message: 'Game level not found' },
          { status: 404 }
        );
      }

      return Response.json({
        message: 'Game level updated successfully',
        level: updatedLevel
      });
    }

    if (request.method === 'DELETE') {
      const deletedLevel = await GameLevel.findByIdAndDelete(levelId);
      
      if (!deletedLevel) {
        return Response.json(
          { message: 'Game level not found' },
          { status: 404 }
        );
      }

      return Response.json({
        message: 'Game level deleted successfully'
      });
    }
  } catch (error) {
    console.error('Admin level operation error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);
export const PUT = withAdminAuth(handler);
export const DELETE = withAdminAuth(handler);