import mongoose from 'mongoose';

const GameLevelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    enum: ['memory', 'breathing', 'puzzle', 'mindfulness', 'selfcare'],
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  content: {
    instructions: String,
    gameConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    media: {
      images: [String],
      videos: [String],
      audio: [String]
    },
    journalPrompts: [String],
    completionMessage: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
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

export default mongoose.models.GameLevel || mongoose.model('GameLevel', GameLevelSchema);