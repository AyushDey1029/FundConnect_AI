import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'donation',
        'comment',
        'system',
        'campaign_approval',
        'campaign_update',
        'withdrawal_approval'
      ],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedItem: {
      // Could be Campaign ID, Comment ID, etc., depending on the type
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['Campaign', 'Comment', 'Donation', 'Withdrawal'],
    }
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
