import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';

export async function POST(request) {
    try {
        await dbConnect();
        const { token, userType = 'user' } = await request.json();

        if (!token) {
            return Response.json(
                { message: 'Token is required' },
                { status: 400 }
            );
        }

        // Find user with valid reset token
        const Model = userType === 'admin' ? Admin : User;
        const user = await Model.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return Response.json(
                { message: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        return Response.json(
            { message: 'Valid reset token' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Validate reset token error:', error);
        return Response.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}