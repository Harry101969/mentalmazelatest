'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  Coins,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminNavbar from '@/components/admin-navbar';
import { toast } from 'sonner';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      } else {
        toast.error('Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Error loading payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await fetch('/api/admin/payments/stats', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  const exportPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments/export', {
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Payments exported successfully');
      } else {
        toast.error('Failed to export payments');
      }
    } catch (error) {
      console.error('Error exporting payments:', error);
      toast.error('Export failed');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'refunded': return <TrendingUp className="w-4 h-4 text-blue-600 rotate-180" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'razorpay': return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'qr_code': return <QrCode className="w-4 h-4 text-green-600" />;
      case 'tokens': return <Coins className="w-4 h-4 text-purple-600" />;
      default: return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
              <p className="text-muted-foreground">
                Monitor transactions, revenue, and subscription analytics.
              </p>
            </div>

            <Button onClick={exportPayments} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{stats?.totalRevenue || 0}</p>
                    <p className="text-xs text-green-600">+{stats?.revenueGrowth || 0}% from last month</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">{stats?.totalTransactions || 0}</p>
                    <p className="text-xs text-blue-600">+{stats?.transactionGrowth || 0}% from last month</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">{stats?.successRate || 0}%</p>
                    <p className="text-xs text-purple-600">Payment success rate</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">₹{stats?.monthlyRevenue || 0}</p>
                    <p className="text-xs text-amber-600">{stats?.monthlyTransactions || 0} transactions</p>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Method Breakdown */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-xl font-bold">₹{stats?.razorpayRevenue || 0}</div>
                <div className="text-sm text-muted-foreground">Razorpay Payments</div>
                <div className="text-xs text-blue-600">{stats?.razorpayCount || 0} transactions</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <QrCode className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-xl font-bold">₹{stats?.qrRevenue || 0}</div>
                <div className="text-sm text-muted-foreground">QR Code Payments</div>
                <div className="text-xs text-green-600">{stats?.qrCount || 0} transactions</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Coins className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats?.tokenPayments || 0}</div>
                <div className="text-sm text-muted-foreground">Token Payments</div>
                <div className="text-xs text-purple-600">{stats?.tokensUsed || 0} tokens used</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user name, email, or payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                <SelectItem value="qr_code">QR Code</SelectItem>
                <SelectItem value="tokens">Tokens</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
                <CardDescription>
                  Monitor all payment transactions and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <div
                        key={payment._id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getMethodIcon(payment.paymentMethod)}
                          {getStatusIcon(payment.status)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{payment.userId?.name || 'Unknown User'}</h3>
                            <Badge variant="outline" className="text-xs">
                              {payment.subscriptionType}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {payment.userId?.email || 'No email'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                            {payment.razorpayPaymentId && (
                              <span>ID: {payment.razorpayPaymentId}</span>
                            )}
                            {payment.tokensUsed > 0 && (
                              <span>{payment.tokensUsed} tokens used</span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold">₹{payment.amount}</div>
                          <Badge 
                            variant={payment.status === 'completed' ? 'default' : 
                                   payment.status === 'failed' ? 'destructive' : 
                                   payment.status === 'pending' ? 'secondary' : 'outline'}
                          >
                            {payment.status}
                          </Badge>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Payment Details</DialogTitle>
                              <DialogDescription>
                                Complete information about this transaction
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">User:</span>
                                  <p>{payment.userId?.name}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Email:</span>
                                  <p>{payment.userId?.email}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Amount:</span>
                                  <p>₹{payment.amount}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Method:</span>
                                  <p className="capitalize">{payment.paymentMethod.replace('_', ' ')}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span>
                                  <p className="capitalize">{payment.status}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Date:</span>
                                  <p>{new Date(payment.createdAt).toLocaleString()}</p>
                                </div>
                              </div>

                              {payment.razorpayPaymentId && (
                                <div className="p-3 bg-muted rounded-lg">
                                  <span className="font-medium text-sm">Razorpay Payment ID:</span>
                                  <p className="font-mono text-xs break-all">{payment.razorpayPaymentId}</p>
                                </div>
                              )}

                              {payment.tokensUsed > 0 && (
                                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                  <span className="font-medium text-sm">Tokens Used:</span>
                                  <p>{payment.tokensUsed} tokens (₹{payment.tokensUsed} discount)</p>
                                </div>
                              )}

                              {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                                <div className="p-3 bg-muted rounded-lg">
                                  <span className="font-medium text-sm">Additional Info:</span>
                                  <pre className="text-xs mt-1 overflow-x-auto">
                                    {JSON.stringify(payment.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {searchTerm || statusFilter !== 'all' || methodFilter !== 'all' 
                          ? 'No payments match your filters' 
                          : 'No payments yet'
                        }
                      </h3>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== 'all' || methodFilter !== 'all'
                          ? 'Try adjusting your search criteria or filters.'
                          : 'Payment transactions will appear here once users start subscribing.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenue Chart Placeholder */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Analytics
                </CardTitle>
                <CardDescription>
                  Monthly revenue breakdown and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                    <p className="text-sm text-muted-foreground">Integrate with charting library for detailed analytics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}