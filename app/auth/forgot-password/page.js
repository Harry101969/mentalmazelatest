'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Key, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        toast.success('Password reset instructions sent to your email!');
      } else {
        toast.error(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full w-fit">
              <Key className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {emailSent ? 'Check Your Email' : 'Reset Password'}
            </CardTitle>
            <CardDescription>
              {emailSent
                ? `We've sent password reset instructions to ${email}`
                : 'Enter your email address and we\'ll send you instructions to reset your password'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {emailSent ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Email Sent Successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Please check your email and follow the instructions to reset your password.
                    The reset link will expire in 1 hour for security.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button asChild className="w-full">
                    <Link href="/auth/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                  >
                    Try Different Email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      'Sending instructions...'
                    ) : (
                      <>
                        Send Reset Instructions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Need help?</p>
            <p className="text-xs text-muted-foreground">
              If you don't receive the email within a few minutes, check your spam folder or{' '}
              <a href="mailto:support@mindmaze.com" className="text-primary hover:underline">
                contact support
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}