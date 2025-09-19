import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        await dbConnect();
        const { token, password, userType = 'user' } = await request.json();

        if (!token || !password) {
            return Response.json(
                { message: 'Token and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return Response.json(
                { message: 'Password must be at least 6 characters long' },
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

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password and clear reset token
        await Model.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetToken: undefined,
            resetTokenExpiry: undefined
        });

        return Response.json(
            { message: 'Password reset successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Reset password error:', error);
        return Response.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}