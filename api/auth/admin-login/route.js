import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import OTP from '@/models/OTP';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password, otp, turnstileToken } = await request.json();

    console.log('Admin login attempt for:', email);

    // Validate input
    if (!email || !password || !otp || !turnstileToken) {
      return Response.json(
        { message: 'All fields including OTP are required for admin login' },
        { status: 400 }
      );
    }

    // Verify Cloudflare Turnstile
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
    });

    const turnstileResult = await turnstileResponse.json();
    if (!turnstileResult.success) {
      return Response.json(
        { message: 'Verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return Response.json(
        { message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return Response.json(
        { message: 'Admin account is deactivated' },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return Response.json(
        { message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Verify OTP (required for all admin logins)
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: 'login',
      userType: 'admin',
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      await OTP.findOneAndUpdate(
        { email, type: 'login', userType: 'admin' },
        { $inc: { attempts: 1 } }
      );
      
      return Response.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Update admin last login
    await Admin.findByIdAndUpdate(admin._id, {
      lastLogin: new Date()
    });

    // Mark OTP as verified
    await OTP.findByIdAndUpdate(otpRecord._id, { verified: true });

    // Generate JWT token
    const token = generateToken({
      userId: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: 'admin'
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

    const { password: _, ...adminWithoutPassword } = admin.toObject();

    console.log('Admin login successful for:', email);

    return Response.json({
      message: 'Admin login successful',
      token,
      user: {
        id: admin._id,
        ...adminWithoutPassword
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}