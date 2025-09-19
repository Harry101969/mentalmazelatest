import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import GameLevel from '@/models/GameLevel';
import Payment from '@/models/Payment';
import Therapist from '@/models/Therapist';

async function handler(request) {
  try {
    await dbConnect();

    // Get current month for revenue calculation
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch basic stats
    const [
      totalUsers,
      premiumUsers,
      activeLevels,
      totalTherapists,
      monthlyRevenue,
      recentActivity
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ subscription: 'premium' }),
      GameLevel.countDocuments({ isActive: true }),
      Therapist.countDocuments({ isActive: true }),
      Payment.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: monthStart }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      // Recent activity - last 10 user registrations
      User.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt')
    ]);

    const stats = {
      totalUsers,
      premiumUsers,
      activeLevels,
      totalTherapists,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    };

    // Format recent activity
    const formattedActivity = recentActivity.map(user => ({
      description: `New user registered: ${user.name}`,
      timestamp: user.createdAt,
      type: 'user_registration'
    }));

    return Response.json({
      stats,
      recentActivity: formattedActivity
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);