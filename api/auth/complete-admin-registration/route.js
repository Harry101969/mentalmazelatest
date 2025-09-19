import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import OTP from '@/models/OTP';

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, otp } = await request.json();

    console.log('Completing admin registration for:', email);

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: 'registration',
      userType: 'admin',
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return Response.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return Response.json(
        { message: 'Admin already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
      permissions: {
        canCreateLevels: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canManageAdmins: true,
        canManagePayments: true,
        canManageTherapists: true
      }
    });

    // Mark OTP as verified
    await OTP.findByIdAndUpdate(otpRecord._id, { verified: true });

    console.log('Admin registration completed successfully for:', email);

    return Response.json(
      { 
        message: 'Admin registration completed successfully!',
        admin: {
          id: newAdmin._id,
          email: newAdmin.email,
          name: newAdmin.name
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Complete admin registration error:', error);
    return Response.json(
      { message: 'Internal server error during admin registration' },
      { status: 500 }
    );
  }
}