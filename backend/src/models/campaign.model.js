import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
    },
    goalAmount: {
      type: Number,
      required: [true, 'Goal amount is required'],
      min: [1, 'Goal amount must be at least 1'],
    },
    raisedAmount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    category: {
      type: String,
      enum: [
        'Medical',
        'Education',
        'Startup',
        'Environment',
        'Animal Welfare',
        'NGO',
        'Disaster Relief',
        'Technology',
        'Creative',
        'Community',
        'Health',
        'Other'
      ],
      required: [true, 'Category is required'],
    },
    media: [
      {
        url: { type: String }, // Cloudinary URLs
        type: { type: String, enum: ['image', 'video'] },
        objectPosition: { type: String, default: '50% 50%' }
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'active',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'verified',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    donorsCount: {
      type: Number,
      default: 0,
    },
    trustScore: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      explanation: {
        type: String,
        default: '',
      }
    }
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
