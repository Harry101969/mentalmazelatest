'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, CreditCard, QrCode, Coins, Gift, Star, Zap, Heart, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserNavbar from '@/components/user-navbar';
import { useAuth } from '@/components/auth-provider';
import { toast } from 'sonner';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [tokensToUse, setTokensToUse] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const { user } = useAuth();

  const premiumFeatures = [
    { icon: Crown, text: "Access to Levels 4 & 5", premium: true },
    { icon: Star, text: "Advanced therapeutic content", premium: true },
    { icon: Heart, text: "Personalized AI insights", premium: true },
    { icon: Shield, text: "Priority customer support", premium: true },
    { icon: Zap, text: "Exclusive meditation sessions", premium: true },
    { icon: Gift, text: "Monthly wellness challenges", premium: true }
  ];

  const freeFeatures = [
    { icon: Check, text: "Levels 1, 2 & 3", premium: false },
    { icon: Check, text: "Basic AI companion", premium: false },
    { icon: Check, text: "Mood tracking", premium: false },
    { icon: Check, text: "Journal & reflection", premium: false },
    { icon: Check, text: "Call a friend feature", premium: false },
    { icon: Check, text: "Basic meditation", premium: false }
  ];

  const subscriptionPrice = 100; // ₹100
  const maxTokenDiscount = 50; // Maximum 50% discount with tokens

  const calculateFinalPrice = () => {
    const tokenDiscount = Math.min(tokensToUse, maxTokenDiscount);
    return Math.max(subscriptionPrice - tokenDiscount, subscriptionPrice * 0.5);
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    
    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: calculateFinalPrice(),
          tokensUsed: tokensToUse,
          subscriptionType: 'premium'
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MindMaze',
        description: 'Premium Subscription',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              toast.success('Payment successful! Welcome to Premium!');
              window.location.href = '/dashboard';
            } else {
              toast.error(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#6366f1',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQRPayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/payments/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: calculateFinalPrice(),
          tokensUsed: tokensToUse,
          subscriptionType: 'premium'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setQrCodeUrl(data.qrCodeUrl);
        setShowQRDialog(true);
      } else {
        toast.error(data.message || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('QR payment error:', error);
      toast.error('QR code generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenPayment = async () => {
    if (user?.tokens < subscriptionPrice) {
      toast.error('Insufficient tokens for full payment');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payments/token-upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          tokensUsed: subscriptionPrice,
          subscriptionType: 'premium'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Subscription upgraded using tokens!');
        window.location.href = '/dashboard';
      } else {
        toast.error(data.message || 'Token payment failed');
      }
    } catch (error) {
      console.error('Token payment error:', error);
      toast.error('Token payment failed');
    } finally {
      setLoading(false);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (user?.subscription === 'premium') {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8">
                  <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h1 className="text-3xl font-bold mb-4">You're Premium! 👑</h1>
                  <p className="text-muted-foreground mb-6">
                    You have access to all premium features and content.
                  </p>
                  <Button asChild size="lg">
                    <Link href="/games">Continue Your Journey</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">Unlock Your Full Potential</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Upgrade to Premium and access advanced therapeutic content, personalized insights, 
              and exclusive wellness tools designed by mental health professionals.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">Free Plan</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-3xl font-bold">₹0<span className="text-base font-normal">/month</span></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {freeFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-green-600" />
                          <span>{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Button disabled className="w-full mt-6" variant="outline">
                    Current Plan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="relative border-2 border-primary/50 shadow-xl">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Crown className="w-6 h-6 text-primary" />
                    Premium Plan
                  </CardTitle>
                  <CardDescription>Complete mental wellness toolkit</CardDescription>
                  <div className="text-3xl font-bold">₹100<span className="text-base font-normal">/month</span></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {[...freeFeatures, ...premiumFeatures].map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${feature.premium ? 'text-primary' : 'text-green-600'}`} />
                          <span className={feature.premium ? 'font-medium' : ''}>{feature.text}</span>
                          {feature.premium && <Badge variant="secondary" className="text-xs">Premium</Badge>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Token Discount */}
                  {user?.tokens > 0 && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Coins className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Use Your Tokens</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {user.tokens} available
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="tokens">Tokens to use (₹1 = 1 token, max 50% discount)</Label>
                        <Input
                          id="tokens"
                          type="number"
                          min="0"
                          max={Math.min(user.tokens, maxTokenDiscount)}
                          value={tokensToUse}
                          onChange={(e) => setTokensToUse(parseInt(e.target.value) || 0)}
                          placeholder="Enter tokens to use"
                        />
                        <div className="text-sm text-green-700 dark:text-green-300">
                          Final price: ₹{calculateFinalPrice()} 
                          {tokensToUse > 0 && (
                            <span className="ml-2">
                              (₹{tokensToUse} discount applied)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Methods */}
                  <Tabs defaultValue="razorpay" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="razorpay" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Razorpay
                      </TabsTrigger>
                      <TabsTrigger value="qr" className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        QR Code
                      </TabsTrigger>
                      <TabsTrigger 
                        value="tokens" 
                        disabled={user?.tokens < subscriptionPrice}
                        className="flex items-center gap-2"
                      >
                        <Coins className="w-4 h-4" />
                        Tokens Only
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="razorpay" className="mt-4">
                      <Button 
                        onClick={handleRazorpayPayment} 
                        className="w-full" 
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : `Pay ₹${calculateFinalPrice()} with Razorpay`}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Secure payment via Razorpay • Cards, UPI, Net Banking
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="qr" className="mt-4">
                      <Button 
                        onClick={handleQRPayment} 
                        className="w-full" 
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? 'Generating...' : `Generate QR for ₹${calculateFinalPrice()}`}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Scan QR code with any UPI app • PhonePe, GPay, Paytm
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="tokens" className="mt-4">
                      <Button 
                        onClick={handleTokenPayment} 
                        className="w-full" 
                        size="lg"
                        disabled={loading || user?.tokens < subscriptionPrice}
                      >
                        {loading ? 'Processing...' : `Pay with ${subscriptionPrice} Tokens`}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Use your earned tokens • No additional charges
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* QR Code Dialog */}
          <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Scan QR Code to Pay</DialogTitle>
                <DialogDescription>
                  Use any UPI app to scan and complete the payment
                </DialogDescription>
              </DialogHeader>
              
              <div className="text-center space-y-4">
                {qrCodeUrl && (
                  <div className="flex justify-center">
                    <img src={qrCodeUrl} alt="Payment QR Code" className="w-64 h-64" />
                  </div>
                )}
                <div className="text-lg font-bold">₹{calculateFinalPrice()}</div>
                <p className="text-sm text-muted-foreground">
                  Payment will be verified automatically after successful transaction
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Referral Section */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 text-center">
                <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Earn Free Tokens!</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Share your referral code with friends and earn 10 tokens for each successful signup. 
                  Use tokens to get discounts on your subscription!
                </p>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border mb-6 max-w-md mx-auto">
                  <Label className="text-sm font-medium">Your Referral Code</Label>
                  <div className="text-2xl font-bold text-primary mt-1">
                    {user?.referralCode || 'Loading...'}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(user?.referralCode || '');
                    toast.success('Referral code copied!');
                  }}>
                    Copy Referral Code
                  </Button>
                  <Button variant="outline" onClick={() => {
                    const shareText = `Join me on MindMaze for mental wellness! Use my referral code: ${user?.referralCode}`;
                    if (navigator.share) {
                      navigator.share({ text: shareText });
                    } else {
                      navigator.clipboard.writeText(shareText);
                      toast.success('Share text copied!');
                    }
                  }}>
                    Share with Friends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}