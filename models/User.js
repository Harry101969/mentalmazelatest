import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nickname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number,
    min: 13,
    max: 120
  },
  hobbies: [{
    type: String,
    trim: true
  }],
  avatar: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  subscription: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date
  },
  tokens: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gameProgress: {
    currentLevel: {
      type: Number,
      default: 1
    },
    levelsCompleted: [{
      type: Number
    }],
    totalTimeSpent: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    levelScores: [{
      level: Number,
      score: Number,
      timeSpent: Number,
      completedAt: Date
    }]
  },
  journalEntries: [{
    level: Number,
    content: String,
    mood: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  moodTracker: [{
    mood: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: String,
    date: {
      type: Date,
      default: Date.now
    },
    activities: [String],
    emotions: [String]
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    },
    reminderTime: {
      type: String,
      default: '09:00'
    }
  },
  contacts: [{
    name: String,
    phone: String,
    relationship: String,
    isEmergency: {
      type: Boolean,
      default: false
    }
  }],
  musicPreferences: {
    spotifyConnected: {
      type: Boolean,
      default: false
    },
    preferredGenres: [String],
    savedPlaylists: [String]
  },
  lastOTPVerification: {
    type: Date
  },
  needsOTPReverification: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate referral code before saving
UserSchema.pre('save', function(next) {
  if (!this.referralCode && this.isNew) {
    this.referralCode = `MIND${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  next();
});

// Check if OTP re-verification is needed (7 days)
UserSchema.methods.needsOTPReverification = function() {
  if (!this.lastOTPVerification) return true;
  
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.lastOTPVerification < sevenDaysAgo;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);