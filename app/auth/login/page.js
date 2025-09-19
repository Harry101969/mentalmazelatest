'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Brain, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [step, setStep] = useState(1); // 1: Login Form, 2: OTP Verification (for 7-day check)
  const router = useRouter();
  const { user, login } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
    }
  }, [user, router]);

  // Load Cloudflare Turnstile script
  useEffect(() => {
    if (!window.turnstile && !document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.onload = () => {
        setTurnstileLoaded(true);
      };
      script.onerror = () => {
        toast.error('Failed to load verification script');
      };
      document.head.appendChild(script);
    } else {
      setTurnstileLoaded(true);
    }
  }, []);

  // Render Turnstile widget
  useEffect(() => {
    if (turnstileLoaded && window.turnstile && !turnstileToken) {
      const existingWidget = document.querySelector('.cf-turnstile');
      if (existingWidget && !existingWidget.hasChildNodes()) {
        try {
          window.turnstile.render('.cf-turnstile', {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            callback: function (token) {
              setTurnstileToken(token);
            },
            'error-callback': function (error) {
              console.error('Turnstile error:', error);
              toast.error('Verification failed. Please refresh the page.');
            }
          });
        } catch (error) {
          console.error('Error rendering Turnstile:', error);
        }
      }
    }
  }, [turnstileLoaded, turnstileToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!turnstileToken) {
      toast.error('Please complete the verification');
      return;
    }

    // Admin always needs OTP
    if (activeTab === 'admin') {
      if (!otp) {
        toast.error('OTP is required for admin login');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = activeTab === 'admin' ? '/api/auth/admin-login' : '/api/auth/login';
      const body = activeTab === 'admin' 
        ? { email, password, otp, turnstileToken }
        : { email, password, turnstileToken };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.needsOTP) {
          // User needs OTP re-verification (7-day check)
          setStep(2);
          toast.success('OTP sent to your email for security verification');
        } else {
          toast.success('Login successful!');
          const loginSuccess = await login(data.user, data.token);
          
          if (!loginSuccess) {
            throw new Error('Failed to set authentication state');
          }
        }
      } else {
        toast.error(data.message || 'Login failed');
        if (window.turnstile) {
          window.turnstile.reset('.cf-turnstile');
          setTurnstileToken('');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
      if (window.turnstile) {
        window.turnstile.reset('.cf-turnstile');
        setTurnstileToken('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful!');
        const loginSuccess = await login(data.user, data.token);
        
        if (!loginSuccess) {
          throw new Error('Failed to set authentication state');
        }
      } else {
        toast.error(data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP login error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (step === 2 && activeTab === 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Security Verification</CardTitle>
              <CardDescription>
                Please enter the OTP sent to {email} for security verification
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleOTPLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg font-mono"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-fit">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Continue your mental wellness journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="cf-turnstile"></div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !turnstileToken}>
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="space-y-4">
            <div className="w-full text-center">
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div className="w-full text-center">
              <Link href="/admin/login" className="text-sm text-purple-600 hover:underline font-medium">
                Admin? Sign in here
              </Link>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}