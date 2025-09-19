import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await dbConnect();
    const { name, nickname, email, password, age, hobbies, referralCode, otp } = await request.json();

    console.log('Completing registration for:', email);

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: 'registration',
      userType: 'user',
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return Response.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Handle referral
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
        // Give referrer bonus tokens
        await User.findByIdAndUpdate(referrer._id, {
          $inc: { tokens: 10 }
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      name,
      nickname,
      email,
      password: hashedPassword,
      age: parseInt(age),
      hobbies: hobbies || [],
      referredBy,
      isVerified: true,
      tokens: referredBy ? 5 : 0, // Bonus tokens for referral
      lastOTPVerification: new Date()
    });

    // Mark OTP as verified
    await OTP.findByIdAndUpdate(otpRecord._id, { verified: true });

    // Send welcome email
    await sendWelcomeEmail({
      to: email,
      name,
      referralCode: newUser.referralCode
    });

    console.log('Registration completed successfully for:', email);

    return Response.json(
      { 
        message: 'Registration completed successfully! Welcome to MindMaze!',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          referralCode: newUser.referralCode
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Complete registration error:', error);
    return Response.json(
      { message: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}