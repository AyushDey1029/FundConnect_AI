import mongoose from 'mongoose';

const campaignUpdateSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Update title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Update description is required'],
    },
    media: [
      {
        url: { type: String }, // Cloudinary URLs
        type: { type: String, enum: ['image', 'video'] },
        objectPosition: { type: String, default: '50% 50%' }
      }
    ],
  },
  {
    timestamps: true,
  }
);

const CampaignUpdate = mongoose.model('CampaignUpdate', campaignUpdateSchema);
export default CampaignUpdate;
