import dbConnect from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';
import Admin from '@/models/Admin';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, name, type = 'registration', userType = 'user', turnstileToken } = await request.json();

    console.log('Sending OTP for:', email, 'Type:', type);

    // Verify Cloudflare Turnstile (if provided)
    if (turnstileToken) {
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
    }

    // For registration, check if user already exists
    if (type === 'registration') {
      const Model = userType === 'admin' ? Admin : User;
      const existingUser = await Model.findOne({ email });
      
      if (existingUser) {
        return Response.json(
          { message: `${userType === 'admin' ? 'Admin' : 'User'} already exists with this email` },
          { status: 400 }
        );
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email and type
    await OTP.deleteMany({ email, type, userType });

    // Store OTP
    await OTP.create({
      email,
      otp,
      type,
      userType,
      expiresAt: otpExpiry
    });

    // Send OTP email
    await sendOTPEmail({ to: email, name, otp });

    return Response.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send OTP error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}