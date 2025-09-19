import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail({ to, name, otp }) {
  const mailOptions = {
    from: `"MindMaze" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your MindMaze Verification Code',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #667eea; margin: 0; font-size: 32px; font-weight: bold;">🧠 MindMaze</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 18px;">Your Journey to Mental Wellness</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Welcome to MindMaze! Please verify your email address with the code below:
            </p>
          </div>

          <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0;">
            <h1 style="color: white; font-size: 48px; letter-spacing: 8px; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${otp}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">This code expires in 10 minutes</p>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you didn't request this code, please ignore this email.<br>
              Your account security is important to us.
            </p>
          </div>

          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 MindMaze. Nurturing minds, one level at a time.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail({ to, name, referralCode }) {
  const mailOptions = {
    from: `"MindMaze" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🎉 Welcome to MindMaze - Your Mental Wellness Journey Begins!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 20px; color: white; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 36px;">🧠 Welcome to MindMaze!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your journey to mental wellness starts here</p>
        </div>

        <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${name}! 🌟</h2>
          
          <p style="color: #666; line-height: 1.8; margin-bottom: 30px;">
            Congratulations on taking the first step towards better mental health! MindMaze is designed to guide you through interactive levels that promote mindfulness, emotional regulation, and overall well-being.
          </p>

          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 30px 0;">
            <h3 style="color: #667eea; margin: 0 0 15px 0;">🎮 What Awaits You:</h3>
            <ul style="color: #666; line-height: 2; margin: 0; padding-left: 20px;">
              <li><strong>5 Therapeutic Levels:</strong> From anxiety management to self-care mastery</li>
              <li><strong>AI Therapist:</strong> 24/7 support and guidance</li>
              <li><strong>Mood Tracking:</strong> Monitor your emotional journey</li>
              <li><strong>Mindfulness Tools:</strong> Meditation, breathing exercises, and more</li>
              <li><strong>Community Support:</strong> Connect with mental health professionals</li>
            </ul>
          </div>

          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 25px; border-radius: 10px; margin: 30px 0; color: white; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">Your Referral Code</h3>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">${referralCode}</p>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Share with friends and earn rewards!</p>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);">
              Start Your Journey 🚀
            </a>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Need support? Reach out to us at <a href="mailto:support@mindmaze.com" style="color: #667eea;">support@mindmaze.com</a>
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              © 2024 MindMaze. Nurturing minds, one level at a time.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail({ to, name, resetToken }) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"MindMaze" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your MindMaze Password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #667eea; margin: 0; font-size: 32px;">🧠 MindMaze</h1>
            <h2 style="color: #333; margin: 20px 0;">Password Reset Request</h2>
          </div>

          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Hello ${name},<br><br>
            We received a request to reset your MindMaze password. Click the button below to create a new password:
          </p>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>

          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0;">
            <p style="color: #dc2626; margin: 0; font-size: 14px;">
              <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </p>
          </div>

          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 MindMaze. Nurturing minds, one level at a time.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendAdminCreatedEmail({ to, adminName, temporaryPassword, createdBy }) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/login`;
  
  const mailOptions = {
    from: `"MindMaze Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to MindMaze Admin Panel',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px; border-radius: 20px; color: white; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 36px;">🛡️ Admin Access Granted</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">MindMaze Administration Panel</p>
        </div>

        <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin: 0 0 20px 0;">Welcome ${adminName}!</h2>
          
          <p style="color: #666; line-height: 1.8; margin-bottom: 30px;">
            You have been granted administrator access to MindMaze by ${createdBy}. Use the credentials below to access the admin panel:
          </p>

          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 30px 0;">
            <h3 style="color: #667eea; margin: 0 0 15px 0;">Login Credentials:</h3>
            <p style="color: #333; margin: 10px 0;"><strong>Email:</strong> ${to}</p>
            <p style="color: #333; margin: 10px 0;"><strong>Temporary Password:</strong> <code style="background: #e5e7eb; padding: 5px 10px; border-radius: 5px; font-family: monospace;">${temporaryPassword}</code></p>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Important:</strong> Please change this temporary password immediately after your first login for security purposes.
            </p>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${loginUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
              Access Admin Panel
            </a>
          </div>

          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 MindMaze Admin Panel. Secure access to mental wellness management.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}