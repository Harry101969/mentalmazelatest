import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

async function handler(request) {
  try {
    await dbConnect();

    // Get current month start and end
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Get previous month for comparison
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total revenue and transactions
    const totalStats = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
          razorpayRevenue: {
            $sum: {
              $cond: [{ $eq: ['$paymentMethod', 'razorpay'] }, '$amount', 0]
            }
          },
          qrRevenue: {
            $sum: {
              $cond: [{ $eq: ['$paymentMethod', 'qr_code'] }, '$amount', 0]
            }
          },
          razorpayCount: {
            $sum: {
              $cond: [{ $eq: ['$paymentMethod', 'razorpay'] }, 1, 0]
            }
          },
          qrCount: {
            $sum: {
              $cond: [{ $eq: ['$paymentMethod', 'qr_code'] }, 1, 0]
            }
          },
          tokenPayments: {
            $sum: {
              $cond: [{ $eq: ['$paymentMethod', 'tokens'] }, 1, 0]
            }
          },
          tokensUsed: { $sum: '$tokensUsed' }
        }
      }
    ]);

    // Current month stats
    const monthlyStats = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: monthStart, $lte: monthEnd }
        } 
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$amount' },
          monthlyTransactions: { $sum: 1 }
        }
      }
    ]);

    // Previous month stats for growth calculation
    const prevMonthStats = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd }
        } 
      },
      {
        $group: {
          _id: null,
          prevRevenue: { $sum: '$amount' },
          prevTransactions: { $sum: 1 }
        }
      }
    ]);

    // Success rate calculation
    const successRateStats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          successfulPayments: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const total = totalStats[0] || {};
    const monthly = monthlyStats[0] || {};
    const prevMonth = prevMonthStats[0] || {};
    const successRate = successRateStats[0] || {};

    // Calculate growth percentages
    const revenueGrowth = prevMonth.prevRevenue > 0 
      ? Math.round(((monthly.monthlyRevenue - prevMonth.prevRevenue) / prevMonth.prevRevenue) * 100)
      : 0;
    
    const transactionGrowth = prevMonth.prevTransactions > 0
      ? Math.round(((monthly.monthlyTransactions - prevMonth.prevTransactions) / prevMonth.prevTransactions) * 100)
      : 0;

    const stats = {
      totalRevenue: total.totalRevenue || 0,
      totalTransactions: total.totalTransactions || 0,
      monthlyRevenue: monthly.monthlyRevenue || 0,
      monthlyTransactions: monthly.monthlyTransactions || 0,
      revenueGrowth,
      transactionGrowth,
      successRate: successRate.totalAttempts > 0 
        ? Math.round((successRate.successfulPayments / successRate.totalAttempts) * 100)
        : 0,
      razorpayRevenue: total.razorpayRevenue || 0,
      qrRevenue: total.qrRevenue || 0,
      razorpayCount: total.razorpayCount || 0,
      qrCount: total.qrCount || 0,
      tokenPayments: total.tokenPayments || 0,
      tokensUsed: total.tokensUsed || 0
    };

    return Response.json({ stats });
  } catch (error) {
    console.error('Payment stats error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);