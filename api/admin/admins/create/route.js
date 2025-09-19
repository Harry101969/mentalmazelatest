import bcrypt from 'bcryptjs';
import { withAdminAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { sendAdminCreatedEmail } from '@/lib/email';

// Generate a secure random password
function generateSecurePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

async function handler(request) {
  try {
    await dbConnect();
    const { name, email } = await request.json();
    const creatorInfo = request.user;

    // Validate input
    if (!name || !email) {
      return Response.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return Response.json(
        { message: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    // Generate temporary password
    const temporaryPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
      createdBy: creatorInfo.userId,
      permissions: {
        canCreateLevels: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canManageAdmins: false, // New admins can't manage other admins by default
        canManagePayments: true,
        canManageTherapists: true
      }
    });

    // Send email with credentials
    try {
      await sendAdminCreatedEmail({
        to: email,
        adminName: name,
        temporaryPassword,
        createdBy: creatorInfo.name || creatorInfo.email
      });
    } catch (emailError) {
      console.error('Failed to send admin creation email:', emailError);
      // Delete the created admin if email fails
      await Admin.findByIdAndDelete(newAdmin._id);
      return Response.json(
        { message: 'Failed to send login credentials. Admin account not created.' },
        { status: 500 }
      );
    }

    return Response.json({
      message: 'Administrator created successfully',
      adminId: newAdmin._id
    }, { status: 201 });
  } catch (error) {
    console.error('Admin creation error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(handler);