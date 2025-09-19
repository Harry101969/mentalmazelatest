import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, otp } = await request.json();

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: 'login',
      userType: 'user',
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      // Increment attempts
      await OTP.findOneAndUpdate(
        { email, type: 'login', userType: 'user' },
        { $inc: { attempts: 1 } }
      );
      
      return Response.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's last OTP verification
    await User.findByIdAndUpdate(user._id, {
      lastOTPVerification: new Date(),
      needsOTPReverification: false
    });

    // Mark OTP as verified
    await OTP.findByIdAndUpdate(otpRecord._id, { verified: true });

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: 'user'
    });

    // Set httpOnly cookie
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return Response.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        ...userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}