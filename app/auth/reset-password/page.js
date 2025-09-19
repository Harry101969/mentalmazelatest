'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const userType = searchParams.get('type') || 'user';

    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            return;
        }

        // Validate token on component mount
        validateToken();
    }, [token]);

    const validateToken = async () => {
        try {
            const response = await fetch('/api/auth/validate-reset-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, userType }),
            });

            setIsValidToken(response.ok);

            if (!response.ok) {
                toast.error('Invalid or expired reset link');
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setIsValidToken(false);
            toast.error('Failed to validate reset link');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password,
                    userType
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password reset successfully! You can now sign in with your new password.');
                router.push('/auth/login');
            } else {
                toast.error(data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isValidToken === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isValidToken === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <Card className="shadow-xl border-2 border-red-200 dark:border-red-800">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold text-red-600">Invalid Reset Link</CardTitle>
                            <CardDescription>
                                This password reset link is invalid or has expired
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground mb-6">
                                Password reset links expire after 1 hour for security. Please request a new one.
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/auth/forgot-password">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Request New Reset Link
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl border-2 border-green-200 dark:border-green-800">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full w-fit">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
                        <CardDescription>
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                        disabled={isLoading}
                                        minLength={6}
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

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                        disabled={isLoading}
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}