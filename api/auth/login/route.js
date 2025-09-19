import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { sendOTPEmail } from '@/lib/email';
import OTP from '@/models/OTP';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password, turnstileToken } = await request.json();

    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password || !turnstileToken) {
      return Response.json(
        { message: 'Missing required fields' },
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

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return Response.json(
        { message: 'Please verify your email before logging in' },
        { status: 401 }
      );
    }

    // Check if OTP re-verification is needed (7 days)
    const needsOTPReverification = user.needsOTPReverification();
    
    if (needsOTPReverification) {
      // Generate and send OTP for re-verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await OTP.deleteMany({ email, type: 'login' });
      await OTP.create({
        email,
        otp,
        type: 'login',
        userType: 'user',
        expiresAt: otpExpiry
      });

      await sendOTPEmail({ to: email, name: user.name, otp });

      return Response.json(
        { 
          message: 'OTP sent for security verification',
          needsOTP: true 
        },
        { status: 200 }
      );
    }

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
    console.error('Login error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}