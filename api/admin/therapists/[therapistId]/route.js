import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Therapist from '@/models/Therapist';

async function handler(request, { params }) {
  try {
    await dbConnect();
    const { therapistId } = params;

    if (request.method === 'GET') {
      const therapist = await Therapist.findById(therapistId);
      
      if (!therapist) {
        return Response.json(
          { message: 'Therapist not found' },
          { status: 404 }
        );
      }

      return Response.json({ therapist });
    }

    if (request.method === 'PUT') {
      const {
        name,
        email,
        phone,
        specializations,
        qualifications,
        experience,
        location,
        consultationFee,
        languages,
        bio,
        isVerified,
        isActive
      } = await request.json();

      // Validate required fields
      if (!name || !email || !phone || !specializations || specializations.length === 0) {
        return Response.json(
          { message: 'Name, email, phone, and at least one specialization are required' },
          { status: 400 }
        );
      }

      // Check if email conflicts with another therapist
      const existingTherapist = await Therapist.findOne({ 
        email, 
        _id: { $ne: therapistId } 
      });
      
      if (existingTherapist) {
        return Response.json(
          { message: 'Another therapist with this email already exists' },
          { status: 400 }
        );
      }

      const updatedTherapist = await Therapist.findByIdAndUpdate(
        therapistId,
        {
          name,
          email,
          phone,
          specializations,
          qualifications: qualifications || [],
          experience: experience || 0,
          location: location || {},
          consultationFee: consultationFee || 0,
          languages: languages || [],
          bio: bio || '',
          isVerified: isVerified || false,
          isActive: isActive !== false
        },
        { new: true }
      );

      if (!updatedTherapist) {
        return Response.json(
          { message: 'Therapist not found' },
          { status: 404 }
        );
      }

      return Response.json({
        message: 'Therapist updated successfully',
        therapist: updatedTherapist
      });
    }

    if (request.method === 'DELETE') {
      const deletedTherapist = await Therapist.findByIdAndDelete(therapistId);
      
      if (!deletedTherapist) {
        return Response.json(
          { message: 'Therapist not found' },
          { status: 404 }
        );
      }

      return Response.json({
        message: 'Therapist deleted successfully'
      });
    }
  } catch (error) {
    console.error('Admin therapist operation error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);
export const PUT = withAdminAuth(handler);
export const DELETE = withAdminAuth(handler);