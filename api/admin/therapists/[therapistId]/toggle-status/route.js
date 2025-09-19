import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Therapist from '@/models/Therapist';

async function handler(request, { params }) {
  try {
    await dbConnect();
    const { therapistId } = params;

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return Response.json(
        { message: 'Therapist not found' },
        { status: 404 }
      );
    }

    const updatedTherapist = await Therapist.findByIdAndUpdate(
      therapistId,
      { isActive: !therapist.isActive },
      { new: true }
    );

    return Response.json({
      message: `Therapist ${updatedTherapist.isActive ? 'activated' : 'deactivated'} successfully`,
      therapist: updatedTherapist
    });
  } catch (error) {
    console.error('Toggle therapist status error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = withAdminAuth(handler);