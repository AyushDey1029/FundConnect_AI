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
        'Other'
      ],
      required: [true, 'Category is required'],
    },
    media: [
      {
        type: String, // Cloudinary URLs
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    isVerified: {
      type: Boolean,
      default: false,
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
