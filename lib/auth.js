import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function withAuth(handler) {
  return async (request, context) => {
    try {
      const token = request.cookies.get('auth-token')?.value;
      
      if (!token) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const user = verifyToken(token);
      if (!user) {
        return Response.json({ message: 'Invalid token' }, { status: 401 });
      }

      request.user = user;
      return handler(request, context);
    } catch (error) {
      return Response.json({ message: 'Authentication error' }, { status: 401 });
    }
  };
}

export function withAdminAuth(handler) {
  return async (request, context) => {
    try {
      const token = request.cookies.get('auth-token')?.value;
      
      if (!token) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const user = verifyToken(token);
      if (!user || user.role !== 'admin') {
        return Response.json({ message: 'Admin access required' }, { status: 403 });
      }

      request.user = user;
      return handler(request, context);
    } catch (error) {
      return Response.json({ message: 'Authentication error' }, { status: 401 });
    }
  };
}