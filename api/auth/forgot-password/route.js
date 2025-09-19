import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, userType = 'user' } = await request.json();

        if (!email) {
            return Response.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user or admin
        const Model = userType === 'admin' ? Admin : User;
        const user = await Model.findOne({ email });

        if (!user) {
            // Don't reveal if user exists or not for security
            return Response.json(
                { message: 'If an account with this email exists, you will receive password reset instructions.' },
                { status: 200 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save reset token
        await Model.findByIdAndUpdate(user._id, {
            resetToken,
            resetTokenExpiry
        });

        // Send reset email
        await sendPasswordResetEmail({
            to: email,
            name: user.name,
            resetToken
        });

        return Response.json(
            { message: 'If an account with this email exists, you will receive password reset instructions.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return Response.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}