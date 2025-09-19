import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import OTP from '@/models/OTP';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return Response.json(
        { message: 'Admin not found' },
        { status: 404 }
      );
    }

    if (!admin.isActive) {
      return Response.json(
        { message: 'Admin account is deactivated' },
        { status: 401 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Delete existing OTPs
    await OTP.deleteMany({ email, type: 'login', userType: 'admin' });

    // Store new OTP
    await OTP.create({
      email,
      otp,
      type: 'login',
      userType: 'admin',
      expiresAt: otpExpiry
    });

    // Send OTP email
    await sendOTPEmail({ to: email, name: admin.name, otp });

    return Response.json(
      { message: 'OTP sent to admin email' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send admin OTP error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}