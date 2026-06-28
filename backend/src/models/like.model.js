import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only like a campaign once
likeSchema.index({ user: 1, campaign: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;
