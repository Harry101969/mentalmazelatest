import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Therapist from '@/models/Therapist';

async function handler(request) {
  try {
    await dbConnect();

    if (request.method === 'GET') {
      const therapists = await Therapist.find({}).sort({ createdAt: -1 });

      return Response.json({
        therapists
      });
    }

    if (request.method === 'POST') {
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

      // Check if therapist with email already exists
      const existingTherapist = await Therapist.findOne({ email });
      if (existingTherapist) {
        return Response.json(
          { message: 'A therapist with this email already exists' },
          { status: 400 }
        );
      }

      // Create new therapist
      const newTherapist = await Therapist.create({
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
        isActive: isActive !== false,
        rating: 0,
        reviews: []
      });

      return Response.json({
        message: 'Therapist added successfully',
        therapist: newTherapist
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Admin therapists error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);
export const POST = withAdminAuth(handler);