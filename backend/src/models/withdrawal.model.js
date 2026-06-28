import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Withdrawal amount is required'],
      min: [1, 'Amount must be at least 1'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    requestedDate: {
      type: Date,
      default: Date.now,
    },
    approvedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;
