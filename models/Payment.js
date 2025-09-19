import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'tokens', 'qr_code'],
    default: 'razorpay'
  },
  subscriptionType: {
    type: String,
    enum: ['premium'],
    default: 'premium'
  },
  tokensUsed: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  referralBonus: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);