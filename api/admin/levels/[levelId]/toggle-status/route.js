import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import GameLevel from '@/models/GameLevel';

async function handler(request, { params }) {
  try {
    await dbConnect();
    const { levelId } = params;

    const level = await GameLevel.findById(levelId);
    if (!level) {
      return Response.json(
        { message: 'Game level not found' },
        { status: 404 }
      );
    }

    const updatedLevel = await GameLevel.findByIdAndUpdate(
      levelId,
      { 
        isActive: !level.isActive,
        updatedAt: new Date()
      },
      { new: true }
    );

    return Response.json({
      message: `Level ${updatedLevel.isActive ? 'activated' : 'deactivated'} successfully`,
      level: updatedLevel
    });
  } catch (error) {
    console.error('Toggle level status error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = withAdminAuth(handler);