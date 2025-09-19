import dbConnect from '@/lib/mongodb';
import Therapist from '@/models/Therapist';

export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const specialization = searchParams.get('specialization');

    // Build filter query
    let filter = { isActive: true, isVerified: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specializations: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (location && location !== 'all') {
      filter.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } }
      ];
    }

    if (specialization && specialization !== 'all') {
      filter.specializations = { $in: [specialization] };
    }

    const therapists = await Therapist.find(filter)
      .select('-reviews') // Exclude detailed reviews for list view
      .sort({ rating: -1, createdAt: -1 })
      .limit(50); // Limit results for performance

    return Response.json({
      therapists
    });
  } catch (error) {
    console.error('Therapists fetch error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}